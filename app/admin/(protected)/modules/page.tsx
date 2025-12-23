import { query } from '@/lib/db';
import ModuleTable from '@/components/admin/ModuleTable';

export default async function AdminModulesPage() {
    const { rows: modules } = await query('SELECT * FROM modules ORDER BY name');

    // Stats
    const totalEnabled = modules.filter((m: any) => m.enabled).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Module Management</h1>
                    <p className="text-sm text-gray-500">Control visibility of survey modules on the platform.</p>
                </div>
                <div className="text-sm bg-white px-3 py-1 rounded border shadow-sm">
                    <span className="font-semibold text-green-600">{totalEnabled}</span> Active Modules
                </div>
            </div>

            <ModuleTable modules={modules} />
        </div>
    );
}
