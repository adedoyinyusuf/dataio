'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { validateCSVFile, validateCSVRow, sanitizeNumber, validateYear, isValidUUID, checkRateLimit } from '@/lib/sanitize';
import { getSession } from '@/lib/session';

export async function importCSV(formData: FormData) {
    try {
        // Authentication check
        const session = await getSession();
        if (!session) {
            return { success: false, message: 'Unauthorized' };
        }

        // Rate limiting (10 imports per minute per user)
        const userEmail = session.user?.email || 'unknown';
        if (!checkRateLimit(`import-${userEmail}`, 10, 60000)) {
            return { success: false, message: 'Rate limit exceeded. Please wait before importing again.' };
        }

        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, message: 'No file provided' };
        }

        // Validate file
        const fileValidation = validateCSVFile(file);
        if (!fileValidation.valid) {
            return { success: false, message: fileValidation.error };
        }

        const text = await file.text();

        // Prevent excessively large files
        if (text.length > 5 * 1024 * 1024) { // 5MB text limit
            return { success: false, message: 'File content too large' };
        }

        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
            return { success: false, message: 'CSV file is empty or invalid' };
        }

        // Limit number of rows
        if (lines.length > 10000) {
            return { success: false, message: 'Too many rows. Maximum 10,000 rows allowed per import.' };
        }

        // Parse CSV header
        const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/[^a-z_]/g, ''));
        const requiredCols = ['indicator_id', 'year', 'value'];
        const missingCols = requiredCols.filter(col => !header.includes(col));

        if (missingCols.length > 0) {
            return {
                success: false,
                message: `Missing required columns: ${missingCols.join(', ')}`
            };
        }

        const indicatorIdIdx = header.indexOf('indicator_id');
        const yearIdx = header.indexOf('year');
        const valueIdx = header.indexOf('value');

        let imported = 0;
        const errors: string[] = [];

        // Process each data row
        for (let i = 1; i < lines.length && i <= 10000; i++) {
            const cols = lines[i].split(',').map(c => c.trim());

            const indicatorId = cols[indicatorIdIdx]?.replace(/[^a-f0-9-]/g, '');
            const yearStr = cols[yearIdx]?.replace(/[^0-9]/g, '');
            const valueStr = cols[valueIdx]?.replace(/[^0-9.-]/g, '');

            // Validate row data
            const rowValidation = validateCSVRow({
                indicator_id: indicatorId || '',
                year: yearStr || '',
                value: valueStr || ''
            });

            if (!rowValidation.success) {
                errors.push(`Row ${i + 1}: ${rowValidation.error.issues[0].message}`);
                continue;
            }

            // Additional validation
            if (!isValidUUID(indicatorId)) {
                errors.push(`Row ${i + 1}: Invalid indicator ID format`);
                continue;
            }

            const year = validateYear(yearStr);
            const value = sanitizeNumber(valueStr);

            if (year === null || value === null) {
                errors.push(`Row ${i + 1}: Invalid year or value`);
                continue;
            }

            try {
                // Check if indicator exists (parameterized query prevents SQL injection)
                const { rows } = await query(
                    'SELECT id FROM indicators WHERE id = $1',
                    [indicatorId]
                );

                if (rows.length === 0) {
                    errors.push(`Row ${i + 1}: Indicator not found`);
                    continue;
                }

                // Insert or update (parameterized query prevents SQL injection)
                await query(`
                    INSERT INTO trend_data (indicator_id, year, value)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (indicator_id, year) 
                    DO UPDATE SET value = EXCLUDED.value
                `, [indicatorId, year, value]);

                imported++;
            } catch (error: any) {
                console.error(`Row ${i + 1} error:`, error);
                errors.push(`Row ${i + 1}: Database error`);
            }
        }

        revalidatePath('/admin/data-editor');

        if (imported === 0) {
            return {
                success: false,
                message: 'No data was imported',
                errors: errors.slice(0, 10) // Limit error messages
            };
        }

        return {
            success: true,
            message: `Successfully imported ${imported} row${imported !== 1 ? 's' : ''}`,
            imported,
            errors: errors.length > 0 ? errors.slice(0, 10) : undefined
        };

    } catch (error: any) {
        console.error('Import error:', error);
        return { success: false, message: 'Import failed. Please check file format and try again.' };
    }
}
