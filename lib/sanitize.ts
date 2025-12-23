import { z } from 'zod';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove HTML brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim()
        .slice(0, 500); // Limit length
}

/**
 * Sanitize HTML for display (escape special characters)
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Validate and sanitize CSV data
 */
export function validateCSVRow(row: Record<string, string>) {
    const schema = z.object({
        indicator_id: z.string().uuid('Invalid indicator ID format'),
        year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
        value: z.string().regex(/^-?\d+\.?\d*$/, 'Value must be numeric'),
    });

    return schema.safeParse(row);
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: any): number | null {
    const num = parseFloat(input);
    if (isNaN(num) || !isFinite(num)) {
        return null;
    }
    // Limit to reasonable range
    if (num < -1000000 || num > 1000000) {
        return null;
    }
    return num;
}

/**
 * Validate year input
 */
export function validateYear(year: any): number | null {
    const num = parseInt(year);
    if (isNaN(num)) return null;
    if (num < 1900 || num > 2100) return null;
    return num;
}

/**
 * Sanitize file upload
 */
export function validateCSVFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.name.endsWith('.csv')) {
        return { valid: false, error: 'File must be a CSV file' };
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check MIME type
    if (file.type && !['text/csv', 'text/plain', 'application/vnd.ms-excel'].includes(file.type)) {
        return { valid: false, error: 'Invalid file type' };
    }

    return { valid: true };
}

/**
 * Rate limiting helper
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

/**
 * Validate UUID
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
    return query
        .replace(/[^\w\s-]/g, '') // Only allow alphanumeric, spaces, hyphens
        .trim()
        .slice(0, 100);
}
