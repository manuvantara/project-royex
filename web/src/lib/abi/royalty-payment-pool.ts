export const ROYALTY_PAYMENT_POOL_ADDRESS = '0x59CDac4907845357A13F9520899278CD62Db9950' as `0x${string}`;

export const ROYALTY_PAYMENT_POOL_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_initialOwner', type: 'address' },
      { internalType: 'contract RXRC1', name: '_royaltyToken', type: 'address' },
      { internalType: 'contract IERC20', name: '_stablecoin', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'CheckpointUnorderedInsertion', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountRequested', type: 'uint256' },
      { internalType: 'uint256', name: 'amountAvailable', type: 'uint256' },
    ],
    name: 'ExcessiveWithdrawalAmount',
    type: 'error',
  },
  { inputs: [], name: 'InsufficientRoyaltyRate', type: 'error' },
  { inputs: [], name: 'InvalidAmount', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'OwnableInvalidOwner', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
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
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'deposit', type: 'uint256' },
    ],
    name: 'RoyaltiesDeposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint48', name: 'checkpointKey', type: 'uint48' },
      { indexed: true, internalType: 'address', name: 'investor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'RoyaltiesWithdrawn',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'uint256', name: 'deposit', type: 'uint256' },
    ],
    name: 'depositRoyalties',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint48', name: 'checkpointKey', type: 'uint48' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'getRoyaltyPaymentDetails',
    outputs: [
      { internalType: 'uint256', name: 'royaltyDeposit', type: 'uint256' },
      { internalType: 'uint256', name: 'royaltyBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'royaltyTotalSupply', type: 'uint256' },
      { internalType: 'uint256', name: 'amountWithdrawn', type: 'uint256' },
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
    outputs: [{ internalType: 'contract RXRC1', name: '', type: 'address' }],
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
  {
    inputs: [
      { internalType: 'uint48', name: 'checkpointKey', type: 'uint48' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdrawRoyalties',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;