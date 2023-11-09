/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { Deposit } from './models/Deposit';
export type { GetEstimatedPortfolioValue } from './models/GetEstimatedPortfolioValue';
export type { GetRoyaltyIncomeResponse } from './models/GetRoyaltyIncomeResponse';
export type { GetRoyaltyOffering } from './models/GetRoyaltyOffering';
export type { GetTradingVolume } from './models/GetTradingVolume';
export type { HTTPValidationError } from './models/HTTPValidationError';
export type { Offer } from './models/Offer';
export type { Proposal } from './models/Proposal';
export type { RoyaltyToken } from './models/RoyaltyToken';
export type { ShortenProposal } from './models/ShortenProposal';
export type { TimeSeriesDataPoint } from './models/TimeSeriesDataPoint';
export type { ValidationError } from './models/ValidationError';
export type { ValueIndicator } from './models/ValueIndicator';
export type { Votes } from './models/Votes';

export { CollectivesService } from './services/CollectivesService';
export { OtcMarketsService } from './services/OtcMarketsService';
export { PortfoliosService } from './services/PortfoliosService';
export { ProtocolService } from './services/ProtocolService';
export { PublicRoyaltyOfferingsService } from './services/PublicRoyaltyOfferingsService';
export { RoyaltyExchangesService } from './services/RoyaltyExchangesService';
export { RoyaltyPaymentPoolsService } from './services/RoyaltyPaymentPoolsService';
export { RoyaltyTokensService } from './services/RoyaltyTokensService';
