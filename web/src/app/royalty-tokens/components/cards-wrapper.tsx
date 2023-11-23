import { ProtocolService } from '@/api/requests';
import Card from '@/components/card';
import { calculatePercentageChange } from '@/lib/utils';

export default async function CardsWrapper() {
  const [royaltyIncome, tradingVolume] = await Promise.all([
    ProtocolService.getRoyaltyIncomePerProtocol(),
    ProtocolService.getTradingVolume(),
  ]);

  const { reported: royaltyReported, deposited: royaltyDeposited } = royaltyIncome;
  const { otcMarket, royaltyExchange } = tradingVolume;

  const change = {
    income: {
      reported: calculatePercentageChange(royaltyReported.recentValuesDataset[0].value, royaltyReported.current.value),
      deposited: calculatePercentageChange(
        royaltyDeposited.recentValuesDataset[0].value,
        royaltyDeposited.current.value
      ),
    },
    volume: {
      otc: calculatePercentageChange(otcMarket.recentValuesDataset[0].value, otcMarket.current.value),
      exchange: calculatePercentageChange(royaltyExchange.recentValuesDataset[0].value, royaltyExchange.current.value),
    },
  };

  return (
    <>
      <Card
        title="Total Reported Royalty Income"
        value={royaltyIncome.reported.current.value}
        percentage={change.income.reported}
      />
      <Card
        title="Total Unwithdrawn Royalty Income"
        value={royaltyIncome.deposited.current.value}
        percentage={change.income.deposited}
      />
      <Card title="Total OTC Trading Volume" value={otcMarket.current.value} percentage={change.volume.otc} />
      <Card
        title="Total Royalty Exchange Volume"
        value={royaltyExchange.current.value}
        percentage={change.volume.exchange}
      />
    </>
  );
}
