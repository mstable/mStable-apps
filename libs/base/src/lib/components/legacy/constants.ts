import type { LegacyContract } from './types'

export const StakingABI = [
  {
    inputs: [
      { internalType: 'address', name: '_nexus', type: 'address' },
      { internalType: 'address', name: '_stakingToken', type: 'address' },
      { internalType: 'address', name: '_rewardsToken', type: 'address' },
      { internalType: 'address', name: '_rewardsDistributor', type: 'address' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }],
    name: 'RewardAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
    ],
    name: 'RewardPaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'payer', type: 'address' },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'DURATION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { constant: false, inputs: [], name: 'claimReward', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
    name: 'earned',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { constant: false, inputs: [], name: 'exit', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' },
  {
    constant: true,
    inputs: [],
    name: 'getRewardToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lastTimeRewardApplicable',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lastUpdateTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'nexus',
    outputs: [{ internalType: 'contract INexus', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: '_reward', type: 'uint256' }],
    name: 'notifyRewardAmount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'periodFinish',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardPerToken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardPerTokenStored',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardRate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'rewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardsDistributor',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardsToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: '_rewardsDistributor', type: 'address' }],
    name: 'setRewardsDistribution',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_beneficiary', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'stake',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'stakingToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userRewardPerTokenPaid',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const legacyContracts: LegacyContract[] = [
  {
    address: '0x9b4aba35b35eee7481775ccb4055ce4e176c9a6f',
    name: 'Uniswap',
    info: 'The mStable EARN Pools reward users for contributing to wider ecosystem liquidity by directly rewarding the staking of ecosystem LP tokens in MTA. Pool 5 is a Uniswap MTA<>WETH pool.',
    color: '#FF007A',
    tokenIcon: 'UNI-V2',
  },
  {
    address: '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4',
    name: 'Balancer',
    info: 'The mStable EARN pool for Balancer 95/5 mUSD/MTA.',
    color: '#CFD4FF',
    tokenIcon: 'BAL',
  },
  {
    address: '0x25970282aac735cd4c76f30bfb0bf2bc8dad4e70',
    name: 'Balancer',
    info: 'The mStable EARN Pools reward users for contributing to wider ecosystem liquidity by directly rewarding the staking of ecosystem LP tokens in MTA. Pool 3 is a Balancer mUSD<>MTA pool.',
    color: '#CFD4FF',
    tokenIcon: 'BAL',
  },
  {
    address: '0x881c72d1e6317f10a1cdcbe05040e7564e790c80',
    name: 'Balancer',
    info: 'The mStable EARN Pools reward users for contributing to wider ecosystem liquidity by directly rewarding the staking of ecosystem LP tokens in MTA. Pool 1 is a Balancer mUSD<>USDC pool.',
    color: '#CFD4FF',
    tokenIcon: 'BAL',
  },
  {
    address: '0xf4a7d2d85f4ba11b5c73c35e27044c0c49f7f027',
    name: 'Balancer',
    info: 'The mStable EARN Pools reward users for contributing to wider ecosystem liquidity by directly rewarding the staking of ecosystem LP tokens in MTA. Pool 4 is a Balancer mUSD<>MTA pool.',
    color: '#CFD4FF',
    tokenIcon: 'BAL',
  },
  {
    address: '0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb',
    name: 'Balancer',
    info: 'The mStable EARN Pools reward users for contributing to wider ecosystem liquidity by directly rewarding the staking of ecosystem LP tokens in MTA. Pool 2 is a Balancer mUSD<>WETH pool.',
    color: '#CFD4FF',
    tokenIcon: 'BAL',
  },
  {
    address: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    name: 'vMTA',
    info: 'Voting MTA contract',
    color: '#CFD4FF',
    tokenIcon: 'BAL',
  },
]
