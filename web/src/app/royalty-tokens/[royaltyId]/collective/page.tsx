import { CollectivesService } from '@/api/requests';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const proposals = await CollectivesService.fetchProposals(royaltyId);

  return (
    <div className="px-4 pb-8 pt-8 md:pt-12">
      <DataTable data={proposals} columns={columns} />
    </div>
  );
}
