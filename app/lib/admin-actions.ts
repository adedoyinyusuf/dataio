'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleModuleStatus(moduleId: string, currentStatus: boolean) {
    try {
        await query(
            'UPDATE modules SET enabled = $1 WHERE id = $2',
            [!currentStatus, moduleId]
        );
        revalidatePath('/admin/modules');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle module:', error);
        return { success: false, error: 'Database Error' };
    }
}

export async function updateModuleDetails(moduleId: string, name: string, description: string) {
    try {
        await query(
            'UPDATE modules SET name = $1, description = $2 WHERE id = $3',
            [name, description, moduleId]
        );
        revalidatePath('/admin/modules');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database Updated Failed' };
    }
}

export async function cleanupEmptyCategories() {
    try {
        const result = await query(`
            DELETE FROM categories 
            WHERE id IN (
                SELECT c.id FROM categories c
                LEFT JOIN indicators i ON c.id = i.category_id
                WHERE i.id IS NULL
            )
        `);
        revalidatePath('/admin/audit');
        return { success: true, count: result.rowCount };
    } catch (error) {
        return { success: false, error: 'Cleanup Failed' };
    }
}
