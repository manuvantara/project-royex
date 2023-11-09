export const OTC_MARKET_ADDRESS = '0xeE7d93aD7d2Fb044F2e66bE4c1B58aACC7767217' as `0x${string}`;

export const OTC_MARKET_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'initialOwner', type: 'address' },
      { internalType: 'contract IERC20', name: 'royaltyToken', type: 'address' },
      { internalType: 'contract IERC20', name: 'stablecoin', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'stablecoinAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'minStablecoinAmount', type: 'uint256' },
    ],
    name: 'InsufficientStablecoinAmount',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestedAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'availableAmount', type: 'uint256' },
    ],
    name: 'InsufficientTradingFeeRevenue',
    type: 'error',
  },
  { inputs: [], name: 'InvalidAmount', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
    name: 'OfferAlreadyExists',
    type: 'error',
  },
  { inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }], name: 'OfferNotFound', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'OwnableInvalidOwner', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'address', name: 'seller', type: 'address' },
    ],
    name: 'UnauthorizedOfferCancellation',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'offerId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
    ],
    name: 'OfferAccepted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'offerId', type: 'uint256' }],
    name: 'OfferCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'offerId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'seller', type: 'address' },
      { indexed: false, internalType: 'uint128', name: 'royaltyTokenAmount', type: 'uint128' },
      { indexed: false, internalType: 'uint128', name: 'stablecoinAmount', type: 'uint128' },
    ],
    name: 'OfferCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
    name: 'cancelOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'collectTradingFeeRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint128', name: 'royaltyTokenAmount', type: 'uint128' },
      { internalType: 'uint128', name: 'stablecoinAmount', type: 'uint128' },
    ],
    name: 'createOffer',
    outputs: [{ internalType: 'uint256', name: 'newOfferId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'seller', type: 'address' },
      { internalType: 'uint128', name: 'royaltyTokenAmount', type: 'uint128' },
      { internalType: 'uint128', name: 'stablecoinAmount', type: 'uint128' },
    ],
    name: 'hashOffer',
    outputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
    name: 'offers',
    outputs: [
      { internalType: 'address', name: 'seller', type: 'address' },
      { internalType: 'uint128', name: 'royaltyTokenAmount', type: 'uint128' },
      { internalType: 'uint128', name: 'stablecoinAmount', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'royaltyToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stablecoin',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tradingFeeRevenue',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
