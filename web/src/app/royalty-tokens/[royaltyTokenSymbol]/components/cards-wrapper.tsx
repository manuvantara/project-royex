import { formatEther } from 'viem';
import { OtcMarketsService, RoyaltyExchangesService, RoyaltyPaymentPoolsService } from '@/api/requests';
import Card from '@/components/card';
import roundUpEther from '@/lib/helpers/round-up-ether';
import { calculatePercentageChange } from '@/lib/utils';

export default async function CardsWrapper({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const [income, otc, exchange] = await Promise.all([
    RoyaltyPaymentPoolsService.getRoyaltyIncome(royaltyTokenSymbol),
    OtcMarketsService.getTradingVolume(royaltyTokenSymbol),
    RoyaltyExchangesService.getTradingVolume(royaltyTokenSymbol),
  ]);

  const { reported, deposited } = income;

  const change = {
    income: {
      reported: calculatePercentageChange(reported.recentValuesDataset[0].value, reported.current.value),
      deposited: calculatePercentageChange(deposited.recentValuesDataset[0].value, deposited.current.value),
    },
    volume: {
      otc: calculatePercentageChange(otc.recentValuesDataset[0].value, otc.current.value),
      exchange: calculatePercentageChange(exchange.recentValuesDataset[0].value, exchange.current.value),
    },
  };

  return (
    <>
      <Card
        title="Symbol Reported Royalty Income"
        value={roundUpEther(formatEther(income.reported.current.value))}
        percentage={change.income.reported}
      />
      <Card
        title="Symbol Deposited Royalty Income"
        value={roundUpEther(formatEther(income.deposited.current.value))}
        percentage={change.income.deposited}
      />
      <Card
        title="Symbol OTC Trading Volume"
        value={roundUpEther(formatEther(otc.current.value))}
        percentage={change.volume.otc}
      />
      <Card
        title="Symbol Royalty Exchange Volume"
        value={roundUpEther(formatEther(exchange.current.value))}
        percentage={change.volume.exchange}
      />
    </>
  );
}
