export const IRO_ADDRESS = '0x740112d91e269F37ABdE55497d1F0e53567Ec0d0' as `0x${string}`;

export const IRO_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'initialOwner', type: 'address' },
      { internalType: 'contract IERC20', name: 'royaltyToken', type: 'address' },
      { internalType: 'contract IERC20', name: 'stablecoin', type: 'address' },
      { internalType: 'uint48', name: 'offeringDate', type: 'uint48' },
      { internalType: 'uint128', name: 'offeringPrice', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'InvalidAmount', type: 'error' },
  {
    inputs: [
      { internalType: 'uint48', name: 'now', type: 'uint48' },
      { internalType: 'uint48', name: 'offeringDate', type: 'uint48' },
    ],
    name: 'OfferingNotAvailable',
    type: 'error',
  },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'OwnableInvalidOwner', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestedAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'availableAmount', type: 'uint256' },
    ],
    name: 'ReserveExceeded',
    type: 'error',
  },
  { inputs: [], name: 'RoyaltyTokensAlreadyDeposited', type: 'error' },
  {
    inputs: [
      { internalType: 'uint8', name: 'bits', type: 'uint8' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error',
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
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint128', name: 'amount', type: 'uint128' }],
    name: 'RoyaltyTokensBought',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint128', name: 'amount', type: 'uint128' }],
    name: 'RoyaltyTokensDeposited',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint128', name: 'amount', type: 'uint128' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint128', name: 'amount', type: 'uint128' }],
    name: 'depositRoyaltyTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'offeringDate',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'offeringPrice',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
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
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
