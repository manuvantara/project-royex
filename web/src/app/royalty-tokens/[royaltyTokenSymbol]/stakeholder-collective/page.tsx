import { CollectivesService } from '@/api/requests';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default async function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  const proposals = await CollectivesService.fetchProposals(royaltyTokenSymbol);

  return <DataTable data={proposals} columns={columns} />;
}
