// generated with @7nohe/openapi-react-query-codegen@0.5.1
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseQueryOptions,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { Deposit } from '../requests/models/Deposit';
import { GetEstimatedPortfolioValue } from '../requests/models/GetEstimatedPortfolioValue';
import { GetRoyaltyIncomeResponse } from '../requests/models/GetRoyaltyIncomeResponse';
import { GetRoyaltyOffering } from '../requests/models/GetRoyaltyOffering';
import { GetTradingVolume } from '../requests/models/GetTradingVolume';
import { HTTPValidationError } from '../requests/models/HTTPValidationError';
import { Offer } from '../requests/models/Offer';
import { Proposal } from '../requests/models/Proposal';
import { ProposalDescription } from '../requests/models/ProposalDescription';
import { ProposalInfo } from '../requests/models/ProposalInfo';
import { ProposalVotes } from '../requests/models/ProposalVotes';
import { RoyaltyToken } from '../requests/models/RoyaltyToken';
import { TimeSeriesDataPoint } from '../requests/models/TimeSeriesDataPoint';
import { ValidationError } from '../requests/models/ValidationError';
import { ValueIndicator } from '../requests/models/ValueIndicator';
import { CollectivesService } from '../requests/services/CollectivesService';
import { OtcMarketsService } from '../requests/services/OtcMarketsService';
import { PortfoliosService } from '../requests/services/PortfoliosService';
import { ProtocolService } from '../requests/services/ProtocolService';
import { PublicRoyaltyOfferingsService } from '../requests/services/PublicRoyaltyOfferingsService';
import { RoyaltyExchangesService } from '../requests/services/RoyaltyExchangesService';
import { RoyaltyPaymentPoolsService } from '../requests/services/RoyaltyPaymentPoolsService';
import { RoyaltyTokensService } from '../requests/services/RoyaltyTokensService';
export const useRoyaltyTokensServiceGetContractAddressKey = 'RoyaltyTokensServiceGetContractAddress';
export const useRoyaltyTokensServiceGetContractAddress = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyTokensService.getContractAddress>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyTokensService.getContractAddress>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyTokensService.getContractAddress>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyTokensServiceGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyTokensService.getContractAddress(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyTokensService.getContractAddress>>, TError>, 'data'> & {
    data: TData;
  };
export const useRoyaltyTokensServiceFetchPublicKey = 'RoyaltyTokensServiceFetchPublic';
export const useRoyaltyTokensServiceFetchPublic = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyTokensService.fetchPublic>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyTokensService.fetchPublic>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyTokensService.fetchPublic>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyTokensServiceFetchPublicKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyTokensService.fetchPublic(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyTokensService.fetchPublic>>, TError>, 'data'> & {
    data: TData;
  };
export const useRoyaltyTokensServiceFetchPrivateKey = 'RoyaltyTokensServiceFetchPrivate';
export const useRoyaltyTokensServiceFetchPrivate = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyTokensService.fetchPrivate>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyTokensService.fetchPrivate>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyTokensService.fetchPrivate>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyTokensServiceFetchPrivateKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyTokensService.fetchPrivate(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyTokensService.fetchPrivate>>, TError>, 'data'> & {
    data: TData;
  };
export const useRoyaltyPaymentPoolsServiceGetContractAddressKey = 'RoyaltyPaymentPoolsServiceGetContractAddress';
export const useRoyaltyPaymentPoolsServiceGetContractAddress = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getContractAddress>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getContractAddress>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getContractAddress>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyPaymentPoolsServiceGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyPaymentPoolsService.getContractAddress(royaltyTokenSymbol),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getContractAddress>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const useRoyaltyPaymentPoolsServiceGetRoyaltyIncomeKey = 'RoyaltyPaymentPoolsServiceGetRoyaltyIncome';
export const useRoyaltyPaymentPoolsServiceGetRoyaltyIncome = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getRoyaltyIncome>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getRoyaltyIncome>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getRoyaltyIncome>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyPaymentPoolsServiceGetRoyaltyIncomeKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyPaymentPoolsService.getRoyaltyIncome(royaltyTokenSymbol),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.getRoyaltyIncome>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const useRoyaltyPaymentPoolsServiceFetchDepositsKey = 'RoyaltyPaymentPoolsServiceFetchDeposits';
export const useRoyaltyPaymentPoolsServiceFetchDeposits = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.fetchDeposits>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.fetchDeposits>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.fetchDeposits>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyPaymentPoolsServiceFetchDepositsKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyPaymentPoolsService.fetchDeposits(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.fetchDeposits>>, TError>, 'data'> & {
    data: TData;
  };
export const useRoyaltyExchangesServiceGetContractAddressKey = 'RoyaltyExchangesServiceGetContractAddress';
export const useRoyaltyExchangesServiceGetContractAddress = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyExchangesService.getContractAddress>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyExchangesService.getContractAddress>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyExchangesService.getContractAddress>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyExchangesServiceGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyExchangesService.getContractAddress(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyExchangesService.getContractAddress>>, TError>, 'data'> & {
    data: TData;
  };
export const useRoyaltyExchangesServiceGetPriceKey = 'RoyaltyExchangesServiceGetPrice';
export const useRoyaltyExchangesServiceGetPrice = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyExchangesService.getPrice>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyExchangesService.getPrice>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyExchangesService.getPrice>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyExchangesServiceGetPriceKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyExchangesService.getPrice(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyExchangesService.getPrice>>, TError>, 'data'> & {
    data: TData;
  };
export const useRoyaltyExchangesServiceGetTradingVolumeKey = 'RoyaltyExchangesServiceGetTradingVolume';
export const useRoyaltyExchangesServiceGetTradingVolume = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof RoyaltyExchangesService.getTradingVolume>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof RoyaltyExchangesService.getTradingVolume>>,
      unknown,
      Awaited<ReturnType<typeof RoyaltyExchangesService.getTradingVolume>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useRoyaltyExchangesServiceGetTradingVolumeKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => RoyaltyExchangesService.getTradingVolume(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyExchangesService.getTradingVolume>>, TError>, 'data'> & {
    data: TData;
  };
export const usePublicRoyaltyOfferingsServiceGetContractAddressKey = 'PublicRoyaltyOfferingsServiceGetContractAddress';
export const usePublicRoyaltyOfferingsServiceGetContractAddress = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getContractAddress>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getContractAddress>>,
      unknown,
      Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getContractAddress>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePublicRoyaltyOfferingsServiceGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => PublicRoyaltyOfferingsService.getContractAddress(royaltyTokenSymbol),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getContractAddress>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const usePublicRoyaltyOfferingsServiceGetRoyaltyOfferingKey = 'PublicRoyaltyOfferingsServiceGetRoyaltyOffering';
export const usePublicRoyaltyOfferingsServiceGetRoyaltyOffering = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getRoyaltyOffering>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getRoyaltyOffering>>,
      unknown,
      Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getRoyaltyOffering>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePublicRoyaltyOfferingsServiceGetRoyaltyOfferingKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => PublicRoyaltyOfferingsService.getRoyaltyOffering(royaltyTokenSymbol),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.getRoyaltyOffering>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const usePublicRoyaltyOfferingsServiceFetchUpcomingKey = 'PublicRoyaltyOfferingsServiceFetchUpcoming';
export const usePublicRoyaltyOfferingsServiceFetchUpcoming = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.fetchUpcoming>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.fetchUpcoming>>,
      unknown,
      Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.fetchUpcoming>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePublicRoyaltyOfferingsServiceFetchUpcomingKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => PublicRoyaltyOfferingsService.fetchUpcoming(royaltyTokenSymbol),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.fetchUpcoming>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const useProtocolServiceGetTradingVolumeKey = 'ProtocolServiceGetTradingVolume';
export const useProtocolServiceGetTradingVolume = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof ProtocolService.getTradingVolume>>,
  TError = unknown,
>(
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof ProtocolService.getTradingVolume>>,
      unknown,
      Awaited<ReturnType<typeof ProtocolService.getTradingVolume>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useProtocolServiceGetTradingVolumeKey, ...(queryKey ?? [])],
    queryFn: () => ProtocolService.getTradingVolume(),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof ProtocolService.getTradingVolume>>, TError>, 'data'> & {
    data: TData;
  };
export const useProtocolServiceGetRoyaltyIncomePerProtocolKey = 'ProtocolServiceGetRoyaltyIncomePerProtocol';
export const useProtocolServiceGetRoyaltyIncomePerProtocol = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof ProtocolService.getRoyaltyIncomePerProtocol>>,
  TError = unknown,
>(
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof ProtocolService.getRoyaltyIncomePerProtocol>>,
      unknown,
      Awaited<ReturnType<typeof ProtocolService.getRoyaltyIncomePerProtocol>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useProtocolServiceGetRoyaltyIncomePerProtocolKey, ...(queryKey ?? [])],
    queryFn: () => ProtocolService.getRoyaltyIncomePerProtocol(),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof ProtocolService.getRoyaltyIncomePerProtocol>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const usePortfoliosServiceGetEstimatedPortfolioValueKey = 'PortfoliosServiceGetEstimatedPortfolioValue';
export const usePortfoliosServiceGetEstimatedPortfolioValue = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PortfoliosService.getEstimatedPortfolioValue>>,
  TError = unknown,
>(
  {
    stakeholderAddress,
  }: {
    stakeholderAddress: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PortfoliosService.getEstimatedPortfolioValue>>,
      unknown,
      Awaited<ReturnType<typeof PortfoliosService.getEstimatedPortfolioValue>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePortfoliosServiceGetEstimatedPortfolioValueKey, ...(queryKey ?? [{ stakeholderAddress }])],
    queryFn: () => PortfoliosService.getEstimatedPortfolioValue(stakeholderAddress),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.getEstimatedPortfolioValue>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const usePortfoliosServiceCalculateRoyaltyIncomeKey = 'PortfoliosServiceCalculateRoyaltyIncome';
export const usePortfoliosServiceCalculateRoyaltyIncome = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PortfoliosService.calculateRoyaltyIncome>>,
  TError = unknown,
>(
  {
    stakeholderAddress,
  }: {
    stakeholderAddress: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PortfoliosService.calculateRoyaltyIncome>>,
      unknown,
      Awaited<ReturnType<typeof PortfoliosService.calculateRoyaltyIncome>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePortfoliosServiceCalculateRoyaltyIncomeKey, ...(queryKey ?? [{ stakeholderAddress }])],
    queryFn: () => PortfoliosService.calculateRoyaltyIncome(stakeholderAddress),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.calculateRoyaltyIncome>>, TError>, 'data'> & {
    data: TData;
  };
export const usePortfoliosServiceFetchPublicRoyaltyTokensKey = 'PortfoliosServiceFetchPublicRoyaltyTokens';
export const usePortfoliosServiceFetchPublicRoyaltyTokens = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PortfoliosService.fetchPublicRoyaltyTokens>>,
  TError = unknown,
>(
  {
    stakeholderAddress,
  }: {
    stakeholderAddress: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PortfoliosService.fetchPublicRoyaltyTokens>>,
      unknown,
      Awaited<ReturnType<typeof PortfoliosService.fetchPublicRoyaltyTokens>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePortfoliosServiceFetchPublicRoyaltyTokensKey, ...(queryKey ?? [{ stakeholderAddress }])],
    queryFn: () => PortfoliosService.fetchPublicRoyaltyTokens(stakeholderAddress),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.fetchPublicRoyaltyTokens>>, TError>, 'data'> & {
    data: TData;
  };
export const usePortfoliosServiceFetchPrivateRoyaltyTokensKey = 'PortfoliosServiceFetchPrivateRoyaltyTokens';
export const usePortfoliosServiceFetchPrivateRoyaltyTokens = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof PortfoliosService.fetchPrivateRoyaltyTokens>>,
  TError = unknown,
>(
  {
    stakeholderAddress,
  }: {
    stakeholderAddress: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof PortfoliosService.fetchPrivateRoyaltyTokens>>,
      unknown,
      Awaited<ReturnType<typeof PortfoliosService.fetchPrivateRoyaltyTokens>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [usePortfoliosServiceFetchPrivateRoyaltyTokensKey, ...(queryKey ?? [{ stakeholderAddress }])],
    queryFn: () => PortfoliosService.fetchPrivateRoyaltyTokens(stakeholderAddress),
    ...options,
  }) as Omit<
    UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.fetchPrivateRoyaltyTokens>>, TError>,
    'data'
  > & {
    data: TData;
  };
export const useOtcMarketsServiceGetContractAddressKey = 'OtcMarketsServiceGetContractAddress';
export const useOtcMarketsServiceGetContractAddress = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof OtcMarketsService.getContractAddress>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof OtcMarketsService.getContractAddress>>,
      unknown,
      Awaited<ReturnType<typeof OtcMarketsService.getContractAddress>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useOtcMarketsServiceGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => OtcMarketsService.getContractAddress(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof OtcMarketsService.getContractAddress>>, TError>, 'data'> & {
    data: TData;
  };
export const useOtcMarketsServiceGetFloorPriceKey = 'OtcMarketsServiceGetFloorPrice';
export const useOtcMarketsServiceGetFloorPrice = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof OtcMarketsService.getFloorPrice>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof OtcMarketsService.getFloorPrice>>,
      unknown,
      Awaited<ReturnType<typeof OtcMarketsService.getFloorPrice>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useOtcMarketsServiceGetFloorPriceKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => OtcMarketsService.getFloorPrice(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof OtcMarketsService.getFloorPrice>>, TError>, 'data'> & {
    data: TData;
  };
export const useOtcMarketsServiceGetTradingVolumeKey = 'OtcMarketsServiceGetTradingVolume';
export const useOtcMarketsServiceGetTradingVolume = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof OtcMarketsService.getTradingVolume>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof OtcMarketsService.getTradingVolume>>,
      unknown,
      Awaited<ReturnType<typeof OtcMarketsService.getTradingVolume>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useOtcMarketsServiceGetTradingVolumeKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => OtcMarketsService.getTradingVolume(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof OtcMarketsService.getTradingVolume>>, TError>, 'data'> & {
    data: TData;
  };
export const useOtcMarketsServiceFetchOffersKey = 'OtcMarketsServiceFetchOffers';
export const useOtcMarketsServiceFetchOffers = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof OtcMarketsService.fetchOffers>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof OtcMarketsService.fetchOffers>>,
      unknown,
      Awaited<ReturnType<typeof OtcMarketsService.fetchOffers>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useOtcMarketsServiceFetchOffersKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => OtcMarketsService.fetchOffers(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof OtcMarketsService.fetchOffers>>, TError>, 'data'> & {
    data: TData;
  };
export const useCollectivesServiceGetContractAddressKey = 'CollectivesServiceGetContractAddress';
export const useCollectivesServiceGetContractAddress = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof CollectivesService.getContractAddress>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof CollectivesService.getContractAddress>>,
      unknown,
      Awaited<ReturnType<typeof CollectivesService.getContractAddress>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useCollectivesServiceGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => CollectivesService.getContractAddress(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof CollectivesService.getContractAddress>>, TError>, 'data'> & {
    data: TData;
  };
export const useCollectivesServiceFetchProposalsKey = 'CollectivesServiceFetchProposals';
export const useCollectivesServiceFetchProposals = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof CollectivesService.fetchProposals>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
  }: {
    royaltyTokenSymbol: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof CollectivesService.fetchProposals>>,
      unknown,
      Awaited<ReturnType<typeof CollectivesService.fetchProposals>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useCollectivesServiceFetchProposalsKey, ...(queryKey ?? [{ royaltyTokenSymbol }])],
    queryFn: () => CollectivesService.fetchProposals(royaltyTokenSymbol),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof CollectivesService.fetchProposals>>, TError>, 'data'> & {
    data: TData;
  };
export const useCollectivesServiceGetProposalKey = 'CollectivesServiceGetProposal';
export const useCollectivesServiceGetProposal = <
  TQueryKey extends Array<unknown> = unknown[],
  TData = Awaited<ReturnType<typeof CollectivesService.getProposal>>,
  TError = unknown,
>(
  {
    royaltyTokenSymbol,
    proposalId,
  }: {
    royaltyTokenSymbol: string;
    proposalId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof CollectivesService.getProposal>>,
      unknown,
      Awaited<ReturnType<typeof CollectivesService.getProposal>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >
) =>
  useQuery({
    queryKey: [useCollectivesServiceGetProposalKey, ...(queryKey ?? [{ royaltyTokenSymbol, proposalId }])],
    queryFn: () => CollectivesService.getProposal(royaltyTokenSymbol, proposalId),
    ...options,
  }) as Omit<UseQueryResult<Awaited<ReturnType<typeof CollectivesService.getProposal>>, TError>, 'data'> & {
    data: TData;
  };
