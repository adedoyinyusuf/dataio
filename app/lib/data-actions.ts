'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sanitizeNumber, isValidUUID } from '@/lib/sanitize';
import { getSession } from '@/lib/session';

export async function updateDataValue(dataId: string, newValue: number, indicatorId: string) {
    try {
        // Authentication check
        const session = await getSession();
        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        // Validate UUIDs
        if (!isValidUUID(dataId) || !isValidUUID(indicatorId)) {
            return { success: false, error: 'Invalid ID format' };
        }

        // Sanitize and validate value
        const sanitizedValue = sanitizeNumber(newValue);
        if (sanitizedValue === null) {
            return { success: false, error: 'Invalid value' };
        }

        // Parameterized query prevents SQL injection
        await query(
            'UPDATE trend_data SET value = $1 WHERE id = $2',
            [sanitizedValue, dataId]
        );

        revalidatePath(`/admin/data-editor`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update data:', error);
        return { success: false, error: 'Database Error' };
    }
}
