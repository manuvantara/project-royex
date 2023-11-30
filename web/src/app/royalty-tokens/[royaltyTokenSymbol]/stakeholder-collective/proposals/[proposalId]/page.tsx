import { ArrowBottomRightIcon, ArrowTopRightIcon, SizeIcon } from '@radix-ui/react-icons';
import { CollectivesService } from '@/api/requests';
import { handleNotFoundResponse } from '@/lib/utils';
import CastVote from './components/cast-vote';

export default async function Page({
  params: { royaltyTokenSymbol, proposalId },
}: {
  params: { royaltyTokenSymbol: string; proposalId: string };
}) {
  const proposal = await handleNotFoundResponse(CollectivesService.getProposal(royaltyTokenSymbol, proposalId));

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{proposal?.info.title}</h2>
      <div className="grid h-full items-stretch gap-6 py-6 md:grid-cols-[1fr_350px]">
        <div className="rounded-xl border p-6">
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: proposal?.description.description }}
          />
        </div>
        <div className="rounded-xl border p-6 shadow">
          <h3 className="mb-4 text-lg font-medium">Votes</h3>
          <div className="grid gap-2">
            <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-medium tracking-tight">For</span>
                <ArrowTopRightIcon className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-xl font-semibold">{proposal.info.votes.pro}</div>
            </div>
            <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-medium tracking-tight">Against</span>
                <ArrowBottomRightIcon className="h-4 w-4 text-destructive" />
              </div>
              <div className="text-xl font-semibold">{proposal.info.votes.contra}</div>
            </div>
            <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-medium tracking-tight">Abstain</span>
                <SizeIcon className="h-4 w-4" />
              </div>
              <div className="text-xl font-semibold">{proposal.info.votes.abstain}</div>
            </div>
          </div>
          <div className="mt-6 grid">
            <CastVote proposalId={proposalId} />
          </div>
        </div>
      </div>
    </>
  );
}
