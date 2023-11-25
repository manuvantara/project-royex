import { ArrowBottomRightIcon, ArrowTopRightIcon, SizeIcon } from '@radix-ui/react-icons';
import CastVote from './components/cast-vote';
import { CollectivesService } from '@/api/requests';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';

export default async function Page({ params }: { params: { royaltyTokenSymbol: string; proposalId: string } }) {
  const proposal = await CollectivesService.getProposal(params.royaltyTokenSymbol, params.proposalId);

  return (
    <div className="container relative">
      <div className="flex h-full flex-col overflow-hidden bg-background px-4 pb-8">
        <PageHeader className="px-0 pb-8">
          <PageHeaderHeading>{proposal?.info.title}</PageHeaderHeading>
        </PageHeader>
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
                  <ArrowTopRightIcon className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-xl font-semibold">{proposal.info.votes.pro}</div>
              </div>
              <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm font-medium tracking-tight">Against</span>
                  <ArrowBottomRightIcon className="h-6 w-6 text-destructive" />
                </div>
                <div className="text-xl font-semibold">{proposal.info.votes.contra}</div>
              </div>
              <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm font-medium tracking-tight">Abstain</span>
                  <SizeIcon className="h-6 w-6" />
                </div>
                <div className="text-xl font-semibold">{proposal.info.votes.abstain}</div>
              </div>
            </div>
            <div className="mt-6 grid">
              <CastVote proposalId={params.proposalId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
