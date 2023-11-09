// generated with @7nohe/openapi-react-query-codegen@0.5.1 
import { useQuery, useMutation, UseQueryResult, UseQueryOptions, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { Votes } from "../requests/models/Votes";
import { ValueIndicator } from "../requests/models/ValueIndicator";
import { ValidationError } from "../requests/models/ValidationError";
import { TimeSeriesDataPoint } from "../requests/models/TimeSeriesDataPoint";
import { ShortenProposal } from "../requests/models/ShortenProposal";
import { RoyaltyToken } from "../requests/models/RoyaltyToken";
import { Proposal } from "../requests/models/Proposal";
import { HTTPValidationError } from "../requests/models/HTTPValidationError";
import { GetTradingVolume } from "../requests/models/GetTradingVolume";
import { GetRoyaltyOffering } from "../requests/models/GetRoyaltyOffering";
import { GetRoyaltyIncomeResponse } from "../requests/models/GetRoyaltyIncomeResponse";
import { GetEstimatedPortfolioValue } from "../requests/models/GetEstimatedPortfolioValue";
import { Deposit } from "../requests/models/Deposit";
import { RoyaltyTokensService } from "../requests/services/RoyaltyTokensService";
import { RoyaltyPaymentPoolsService } from "../requests/services/RoyaltyPaymentPoolsService";
import { RoyaltyExchangesService } from "../requests/services/RoyaltyExchangesService";
import { PublicRoyaltyOfferingsService } from "../requests/services/PublicRoyaltyOfferingsService";
import { ProtocolService } from "../requests/services/ProtocolService";
import { PortfoliosService } from "../requests/services/PortfoliosService";
import { OtcMarketsService } from "../requests/services/OtcMarketsService";
import { CollectivesService } from "../requests/services/CollectivesService";
export const useRoyaltyTokensServiceRoyaltyTokensGetContractAddressKey = "RoyaltyTokensServiceRoyaltyTokensGetContractAddress";
export const useRoyaltyTokensServiceRoyaltyTokensGetContractAddress = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensGetContractAddress>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensGetContractAddress>>, unknown, Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensGetContractAddress>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyTokensServiceRoyaltyTokensGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => RoyaltyTokensService.royaltyTokensGetContractAddress(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensGetContractAddress>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyTokensServiceRoyaltyTokensFetchPublicKey = "RoyaltyTokensServiceRoyaltyTokensFetchPublic";
export const useRoyaltyTokensServiceRoyaltyTokensFetchPublic = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPublic>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPublic>>, unknown, Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPublic>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyTokensServiceRoyaltyTokensFetchPublicKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => RoyaltyTokensService.royaltyTokensFetchPublic(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPublic>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyTokensServiceRoyaltyTokensFetchPrivateKey = "RoyaltyTokensServiceRoyaltyTokensFetchPrivate";
export const useRoyaltyTokensServiceRoyaltyTokensFetchPrivate = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPrivate>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPrivate>>, unknown, Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPrivate>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyTokensServiceRoyaltyTokensFetchPrivateKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => RoyaltyTokensService.royaltyTokensFetchPrivate(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyTokensService.royaltyTokensFetchPrivate>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetContractAddressKey = "RoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetContractAddress";
export const useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetContractAddress = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetContractAddress>>, TError = unknown>({ royaltyId }: {
    royaltyId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetContractAddress>>, unknown, Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetContractAddress>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetContractAddressKey, ...(queryKey ?? [{ royaltyId }])], queryFn: () => RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetContractAddress(royaltyId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetContractAddress>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetRoyaltyIncomeKey = "RoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetRoyaltyIncome";
export const useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetRoyaltyIncome = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetRoyaltyIncome>>, TError = unknown>({ royaltyId }: {
    royaltyId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetRoyaltyIncome>>, unknown, Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetRoyaltyIncome>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsGetRoyaltyIncomeKey, ...(queryKey ?? [{ royaltyId }])], queryFn: () => RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetRoyaltyIncome(royaltyId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsGetRoyaltyIncome>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsFetchDepositsKey = "RoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsFetchDeposits";
export const useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsFetchDeposits = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsFetchDeposits>>, TError = unknown>({ royaltyId }: {
    royaltyId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsFetchDeposits>>, unknown, Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsFetchDeposits>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyPaymentPoolsServiceRoyaltyPaymentPoolsFetchDepositsKey, ...(queryKey ?? [{ royaltyId }])], queryFn: () => RoyaltyPaymentPoolsService.royaltyPaymentPoolsFetchDeposits(royaltyId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyPaymentPoolsService.royaltyPaymentPoolsFetchDeposits>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyExchangesServiceRoyaltyExchangesGetContractAddressKey = "RoyaltyExchangesServiceRoyaltyExchangesGetContractAddress";
export const useRoyaltyExchangesServiceRoyaltyExchangesGetContractAddress = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetContractAddress>>, TError = unknown>({ royaltyId }: {
    royaltyId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetContractAddress>>, unknown, Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetContractAddress>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyExchangesServiceRoyaltyExchangesGetContractAddressKey, ...(queryKey ?? [{ royaltyId }])], queryFn: () => RoyaltyExchangesService.royaltyExchangesGetContractAddress(royaltyId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetContractAddress>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyExchangesServiceRoyaltyExchangesGetPriceKey = "RoyaltyExchangesServiceRoyaltyExchangesGetPrice";
export const useRoyaltyExchangesServiceRoyaltyExchangesGetPrice = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetPrice>>, TError = unknown>({ royaltyId }: {
    royaltyId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetPrice>>, unknown, Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetPrice>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyExchangesServiceRoyaltyExchangesGetPriceKey, ...(queryKey ?? [{ royaltyId }])], queryFn: () => RoyaltyExchangesService.royaltyExchangesGetPrice(royaltyId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetPrice>>, TError>, "data"> & {
    data: TData;
};
export const useRoyaltyExchangesServiceRoyaltyExchangesGetTradingVolumeKey = "RoyaltyExchangesServiceRoyaltyExchangesGetTradingVolume";
export const useRoyaltyExchangesServiceRoyaltyExchangesGetTradingVolume = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetTradingVolume>>, TError = unknown>({ royaltyId }: {
    royaltyId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetTradingVolume>>, unknown, Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetTradingVolume>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useRoyaltyExchangesServiceRoyaltyExchangesGetTradingVolumeKey, ...(queryKey ?? [{ royaltyId }])], queryFn: () => RoyaltyExchangesService.royaltyExchangesGetTradingVolume(royaltyId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof RoyaltyExchangesService.royaltyExchangesGetTradingVolume>>, TError>, "data"> & {
    data: TData;
};
export const usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetContractAddressKey = "PublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetContractAddress";
export const usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetContractAddress = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetContractAddress>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetContractAddress>>, unknown, Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetContractAddress>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetContractAddress(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetContractAddress>>, TError>, "data"> & {
    data: TData;
};
export const usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetRoyaltyOfferingKey = "PublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetRoyaltyOffering";
export const usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetRoyaltyOffering = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetRoyaltyOffering>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetRoyaltyOffering>>, unknown, Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetRoyaltyOffering>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsGetRoyaltyOfferingKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetRoyaltyOffering(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsGetRoyaltyOffering>>, TError>, "data"> & {
    data: TData;
};
export const usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsFetchUpcomingKey = "PublicRoyaltyOfferingsServicePublicRoyaltyOfferingsFetchUpcoming";
export const usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsFetchUpcoming = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsFetchUpcoming>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsFetchUpcoming>>, unknown, Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsFetchUpcoming>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePublicRoyaltyOfferingsServicePublicRoyaltyOfferingsFetchUpcomingKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => PublicRoyaltyOfferingsService.publicRoyaltyOfferingsFetchUpcoming(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PublicRoyaltyOfferingsService.publicRoyaltyOfferingsFetchUpcoming>>, TError>, "data"> & {
    data: TData;
};
export const useProtocolServiceProtocolGetTradingVolumeKey = "ProtocolServiceProtocolGetTradingVolume";
export const useProtocolServiceProtocolGetTradingVolume = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof ProtocolService.protocolGetTradingVolume>>, TError = unknown>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof ProtocolService.protocolGetTradingVolume>>, unknown, Awaited<ReturnType<typeof ProtocolService.protocolGetTradingVolume>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useProtocolServiceProtocolGetTradingVolumeKey, ...(queryKey ?? [])], queryFn: () => ProtocolService.protocolGetTradingVolume(), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof ProtocolService.protocolGetTradingVolume>>, TError>, "data"> & {
    data: TData;
};
export const useProtocolServiceProtocolGetRoyaltyIncomePerProtocolKey = "ProtocolServiceProtocolGetRoyaltyIncomePerProtocol";
export const useProtocolServiceProtocolGetRoyaltyIncomePerProtocol = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof ProtocolService.protocolGetRoyaltyIncomePerProtocol>>, TError = unknown>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof ProtocolService.protocolGetRoyaltyIncomePerProtocol>>, unknown, Awaited<ReturnType<typeof ProtocolService.protocolGetRoyaltyIncomePerProtocol>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useProtocolServiceProtocolGetRoyaltyIncomePerProtocolKey, ...(queryKey ?? [])], queryFn: () => ProtocolService.protocolGetRoyaltyIncomePerProtocol(), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof ProtocolService.protocolGetRoyaltyIncomePerProtocol>>, TError>, "data"> & {
    data: TData;
};
export const usePortfoliosServicePortfoliosGetEstimatedPortfolioValueKey = "PortfoliosServicePortfoliosGetEstimatedPortfolioValue";
export const usePortfoliosServicePortfoliosGetEstimatedPortfolioValue = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PortfoliosService.portfoliosGetEstimatedPortfolioValue>>, TError = unknown>({ stakeholderAddress }: {
    stakeholderAddress: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PortfoliosService.portfoliosGetEstimatedPortfolioValue>>, unknown, Awaited<ReturnType<typeof PortfoliosService.portfoliosGetEstimatedPortfolioValue>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePortfoliosServicePortfoliosGetEstimatedPortfolioValueKey, ...(queryKey ?? [{ stakeholderAddress }])], queryFn: () => PortfoliosService.portfoliosGetEstimatedPortfolioValue(stakeholderAddress), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.portfoliosGetEstimatedPortfolioValue>>, TError>, "data"> & {
    data: TData;
};
export const usePortfoliosServicePortfoliosCalculateRoyaltyIncomeKey = "PortfoliosServicePortfoliosCalculateRoyaltyIncome";
export const usePortfoliosServicePortfoliosCalculateRoyaltyIncome = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PortfoliosService.portfoliosCalculateRoyaltyIncome>>, TError = unknown>({ stakeholderAddress }: {
    stakeholderAddress: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PortfoliosService.portfoliosCalculateRoyaltyIncome>>, unknown, Awaited<ReturnType<typeof PortfoliosService.portfoliosCalculateRoyaltyIncome>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePortfoliosServicePortfoliosCalculateRoyaltyIncomeKey, ...(queryKey ?? [{ stakeholderAddress }])], queryFn: () => PortfoliosService.portfoliosCalculateRoyaltyIncome(stakeholderAddress), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.portfoliosCalculateRoyaltyIncome>>, TError>, "data"> & {
    data: TData;
};
export const usePortfoliosServicePortfoliosFetchPublicRoyaltyTokensKey = "PortfoliosServicePortfoliosFetchPublicRoyaltyTokens";
export const usePortfoliosServicePortfoliosFetchPublicRoyaltyTokens = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPublicRoyaltyTokens>>, TError = unknown>({ stakeholderAddress }: {
    stakeholderAddress: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPublicRoyaltyTokens>>, unknown, Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPublicRoyaltyTokens>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePortfoliosServicePortfoliosFetchPublicRoyaltyTokensKey, ...(queryKey ?? [{ stakeholderAddress }])], queryFn: () => PortfoliosService.portfoliosFetchPublicRoyaltyTokens(stakeholderAddress), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPublicRoyaltyTokens>>, TError>, "data"> & {
    data: TData;
};
export const usePortfoliosServicePortfoliosFetchPrivateRoyaltyTokensKey = "PortfoliosServicePortfoliosFetchPrivateRoyaltyTokens";
export const usePortfoliosServicePortfoliosFetchPrivateRoyaltyTokens = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPrivateRoyaltyTokens>>, TError = unknown>({ stakeholderAddress }: {
    stakeholderAddress: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPrivateRoyaltyTokens>>, unknown, Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPrivateRoyaltyTokens>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [usePortfoliosServicePortfoliosFetchPrivateRoyaltyTokensKey, ...(queryKey ?? [{ stakeholderAddress }])], queryFn: () => PortfoliosService.portfoliosFetchPrivateRoyaltyTokens(stakeholderAddress), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof PortfoliosService.portfoliosFetchPrivateRoyaltyTokens>>, TError>, "data"> & {
    data: TData;
};
export const useOtcMarketsServiceOtcMarketsGetContractAddressKey = "OtcMarketsServiceOtcMarketsGetContractAddress";
export const useOtcMarketsServiceOtcMarketsGetContractAddress = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof OtcMarketsService.otcMarketsGetContractAddress>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof OtcMarketsService.otcMarketsGetContractAddress>>, unknown, Awaited<ReturnType<typeof OtcMarketsService.otcMarketsGetContractAddress>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useOtcMarketsServiceOtcMarketsGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => OtcMarketsService.otcMarketsGetContractAddress(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof OtcMarketsService.otcMarketsGetContractAddress>>, TError>, "data"> & {
    data: TData;
};
export const useCollectivesServiceCollectivesGetContractAddressKey = "CollectivesServiceCollectivesGetContractAddress";
export const useCollectivesServiceCollectivesGetContractAddress = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof CollectivesService.collectivesGetContractAddress>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof CollectivesService.collectivesGetContractAddress>>, unknown, Awaited<ReturnType<typeof CollectivesService.collectivesGetContractAddress>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useCollectivesServiceCollectivesGetContractAddressKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => CollectivesService.collectivesGetContractAddress(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof CollectivesService.collectivesGetContractAddress>>, TError>, "data"> & {
    data: TData;
};
export const useCollectivesServiceCollectivesFetchProposalsKey = "CollectivesServiceCollectivesFetchProposals";
export const useCollectivesServiceCollectivesFetchProposals = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof CollectivesService.collectivesFetchProposals>>, TError = unknown>({ royaltyTokenSymbol }: {
    royaltyTokenSymbol: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof CollectivesService.collectivesFetchProposals>>, unknown, Awaited<ReturnType<typeof CollectivesService.collectivesFetchProposals>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useCollectivesServiceCollectivesFetchProposalsKey, ...(queryKey ?? [{ royaltyTokenSymbol }])], queryFn: () => CollectivesService.collectivesFetchProposals(royaltyTokenSymbol), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof CollectivesService.collectivesFetchProposals>>, TError>, "data"> & {
    data: TData;
};
export const useCollectivesServiceCollectivesGetProposalKey = "CollectivesServiceCollectivesGetProposal";
export const useCollectivesServiceCollectivesGetProposal = <TQueryKey extends Array<unknown> = unknown[], TData = Awaited<ReturnType<typeof CollectivesService.collectivesGetProposal>>, TError = unknown>({ royaltyTokenSymbol, proposalId }: {
    royaltyTokenSymbol: string;
    proposalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof CollectivesService.collectivesGetProposal>>, unknown, Awaited<ReturnType<typeof CollectivesService.collectivesGetProposal>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useCollectivesServiceCollectivesGetProposalKey, ...(queryKey ?? [{ royaltyTokenSymbol, proposalId }])], queryFn: () => CollectivesService.collectivesGetProposal(royaltyTokenSymbol, proposalId), ...options }) as Omit<UseQueryResult<Awaited<ReturnType<typeof CollectivesService.collectivesGetProposal>>, TError>, "data"> & {
    data: TData;
};
