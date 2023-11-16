import PageLayout from '../components/page-layout';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { CollectivesService } from '@/api/requests';

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const contractAddress = await CollectivesService.getContractAddress(royaltyId);
  const proposals = await CollectivesService.fetchProposals(royaltyId);

  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="px-4 pb-8 pt-8 md:pt-12">
        <DataTable data={proposals} columns={columns} />
      </div>
    </PageLayout>
  );
}
