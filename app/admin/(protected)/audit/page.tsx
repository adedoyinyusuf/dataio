import { runAudit } from '@/app/lib/audit-service';
import AuditView from '@/components/admin/AuditView';

export default async function AuditPage() {
    const data = await runAudit();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Audit</h1>
                <p className="text-sm text-gray-500">
                    Identify and resolve data integrity issues (orphaned categories, empty surveys).
                </p>
            </div>

            <AuditView data={data} />
        </div>
    );
}
