import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type AccountKeySpecifier = ('completedQuests' | 'delegators' | 'id' | 'lastAction' | 'permMultiplier' | 'permMultiplierSimple' | 'rewardPaidTransactions' | 'seasonMultiplier' | 'seasonMultiplierSimple' | 'stakedTokenAccounts' | 'totalVotesAll' | 'totalVotesAllBD' | 'totalVotesBPT' | 'totalVotesBPTBD' | 'totalVotesMTA' | 'totalVotesMTABD' | AccountKeySpecifier)[];
export type AccountFieldPolicy = {
	completedQuests?: FieldPolicy<any> | FieldReadFunction<any>,
	delegators?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lastAction?: FieldPolicy<any> | FieldReadFunction<any>,
	permMultiplier?: FieldPolicy<any> | FieldReadFunction<any>,
	permMultiplierSimple?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPaidTransactions?: FieldPolicy<any> | FieldReadFunction<any>,
	seasonMultiplier?: FieldPolicy<any> | FieldReadFunction<any>,
	seasonMultiplierSimple?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenAccounts?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotesAll?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotesAllBD?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotesBPT?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotesBPTBD?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotesMTA?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotesMTABD?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CompletedQuestKeySpecifier = ('id' | 'account' | 'quest' | 'completedAt' | CompletedQuestKeySpecifier)[];
export type CompletedQuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	quest?: FieldPolicy<any> | FieldReadFunction<any>,
	completedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CounterKeySpecifier = ('id' | 'value' | CounterKeySpecifier)[];
export type CounterFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetricKeySpecifier = ('bigDecimal' | 'decimals' | 'exact' | 'id' | 'simple' | MetricKeySpecifier)[];
export type MetricFieldPolicy = {
	bigDecimal?: FieldPolicy<any> | FieldReadFunction<any>,
	decimals?: FieldPolicy<any> | FieldReadFunction<any>,
	exact?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	simple?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('token' | 'tokens' | 'metric' | 'metrics' | 'counter' | 'counters' | 'stakedTokenBalance' | 'stakedTokenBalances' | 'quest' | 'quests' | 'season' | 'seasons' | 'completedQuest' | 'completedQuests' | 'stakedToken' | 'stakedTokens' | 'stakingRewards' | 'account' | 'accounts' | 'stakedTokenAccount' | 'stakedTokenAccounts' | 'questManager' | 'questManagers' | 'rewardPaidTransaction' | 'rewardPaidTransactions' | 'transaction' | 'transactions' | '_meta' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	tokens?: FieldPolicy<any> | FieldReadFunction<any>,
	metric?: FieldPolicy<any> | FieldReadFunction<any>,
	metrics?: FieldPolicy<any> | FieldReadFunction<any>,
	counter?: FieldPolicy<any> | FieldReadFunction<any>,
	counters?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenBalances?: FieldPolicy<any> | FieldReadFunction<any>,
	quest?: FieldPolicy<any> | FieldReadFunction<any>,
	quests?: FieldPolicy<any> | FieldReadFunction<any>,
	season?: FieldPolicy<any> | FieldReadFunction<any>,
	seasons?: FieldPolicy<any> | FieldReadFunction<any>,
	completedQuest?: FieldPolicy<any> | FieldReadFunction<any>,
	completedQuests?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedToken?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	stakingRewards?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	accounts?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenAccounts?: FieldPolicy<any> | FieldReadFunction<any>,
	questManager?: FieldPolicy<any> | FieldReadFunction<any>,
	questManagers?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPaidTransaction?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPaidTransactions?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>,
	_meta?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestKeySpecifier = ('id' | 'type' | 'multiplier' | 'status' | 'expiry' | 'season' | 'completions' | QuestKeySpecifier)[];
export type QuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	multiplier?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	expiry?: FieldPolicy<any> | FieldReadFunction<any>,
	season?: FieldPolicy<any> | FieldReadFunction<any>,
	completions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestManagerKeySpecifier = ('id' | 'season' | 'questMaster' | 'questSigner' | QuestManagerKeySpecifier)[];
export type QuestManagerFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	season?: FieldPolicy<any> | FieldReadFunction<any>,
	questMaster?: FieldPolicy<any> | FieldReadFunction<any>,
	questSigner?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RewardPaidTransactionKeySpecifier = ('id' | 'hash' | 'account' | 'stakedTokenAccount' | 'sender' | 'block' | 'timestamp' | 'amount' | RewardPaidTransactionKeySpecifier)[];
export type RewardPaidTransactionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	hash?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	sender?: FieldPolicy<any> | FieldReadFunction<any>,
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SeasonKeySpecifier = ('id' | 'seasonNumber' | 'startedAt' | 'endedAt' | 'quests' | SeasonKeySpecifier)[];
export type SeasonFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seasonNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	startedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	endedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	quests?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StakedTokenKeySpecifier = ('id' | 'token' | 'stakingToken' | 'stakingRewards' | 'questManager' | 'COOLDOWN_SECONDS' | 'UNSTAKE_WINDOW' | 'collateralisationRatio' | 'slashingPercentage' | 'priceCoefficient' | 'isStakedTokenBPT' | 'isStakedTokenMTA' | 'accounts' | StakedTokenKeySpecifier)[];
export type StakedTokenFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	stakingToken?: FieldPolicy<any> | FieldReadFunction<any>,
	stakingRewards?: FieldPolicy<any> | FieldReadFunction<any>,
	questManager?: FieldPolicy<any> | FieldReadFunction<any>,
	COOLDOWN_SECONDS?: FieldPolicy<any> | FieldReadFunction<any>,
	UNSTAKE_WINDOW?: FieldPolicy<any> | FieldReadFunction<any>,
	collateralisationRatio?: FieldPolicy<any> | FieldReadFunction<any>,
	slashingPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	priceCoefficient?: FieldPolicy<any> | FieldReadFunction<any>,
	isStakedTokenBPT?: FieldPolicy<any> | FieldReadFunction<any>,
	isStakedTokenMTA?: FieldPolicy<any> | FieldReadFunction<any>,
	accounts?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StakedTokenAccountKeySpecifier = ('id' | 'account' | 'stakedToken' | 'balance' | 'delegatee' | 'rewardPerTokenPaid' | 'rewards' | 'rewardPaidTransactions' | StakedTokenAccountKeySpecifier)[];
export type StakedTokenAccountFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedToken?: FieldPolicy<any> | FieldReadFunction<any>,
	balance?: FieldPolicy<any> | FieldReadFunction<any>,
	delegatee?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPerTokenPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	rewards?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPaidTransactions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StakedTokenBalanceKeySpecifier = ('account' | 'cooldownTimestamp' | 'cooldownUnits' | 'id' | 'questMultiplier' | 'questMultiplierSimple' | 'raw' | 'rawBD' | 'stakedToken' | 'timeMultiplier' | 'timeMultiplierSimple' | 'votes' | 'votesBD' | 'weightedTimestamp' | StakedTokenBalanceKeySpecifier)[];
export type StakedTokenBalanceFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	cooldownTimestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	cooldownUnits?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	questMultiplier?: FieldPolicy<any> | FieldReadFunction<any>,
	questMultiplierSimple?: FieldPolicy<any> | FieldReadFunction<any>,
	raw?: FieldPolicy<any> | FieldReadFunction<any>,
	rawBD?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedToken?: FieldPolicy<any> | FieldReadFunction<any>,
	timeMultiplier?: FieldPolicy<any> | FieldReadFunction<any>,
	timeMultiplierSimple?: FieldPolicy<any> | FieldReadFunction<any>,
	votes?: FieldPolicy<any> | FieldReadFunction<any>,
	votesBD?: FieldPolicy<any> | FieldReadFunction<any>,
	weightedTimestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StakingRewardsKeySpecifier = ('id' | 'periodFinish' | 'lastUpdateTime' | 'rewardRate' | 'rewardPerTokenStored' | 'rewardsToken' | 'rewardsTokenVendor' | 'rewardsDistributor' | 'pendingAdditionalReward' | 'DURATION' | StakingRewardsKeySpecifier)[];
export type StakingRewardsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	periodFinish?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardRate?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPerTokenStored?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardsToken?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardsTokenVendor?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardsDistributor?: FieldPolicy<any> | FieldReadFunction<any>,
	pendingAdditionalReward?: FieldPolicy<any> | FieldReadFunction<any>,
	DURATION?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('token' | 'tokens' | 'metric' | 'metrics' | 'counter' | 'counters' | 'stakedTokenBalance' | 'stakedTokenBalances' | 'quest' | 'quests' | 'season' | 'seasons' | 'completedQuest' | 'completedQuests' | 'stakedToken' | 'stakedTokens' | 'stakingRewards' | 'account' | 'accounts' | 'stakedTokenAccount' | 'stakedTokenAccounts' | 'questManager' | 'questManagers' | 'rewardPaidTransaction' | 'rewardPaidTransactions' | 'transaction' | 'transactions' | '_meta' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	tokens?: FieldPolicy<any> | FieldReadFunction<any>,
	metric?: FieldPolicy<any> | FieldReadFunction<any>,
	metrics?: FieldPolicy<any> | FieldReadFunction<any>,
	counter?: FieldPolicy<any> | FieldReadFunction<any>,
	counters?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenBalances?: FieldPolicy<any> | FieldReadFunction<any>,
	quest?: FieldPolicy<any> | FieldReadFunction<any>,
	quests?: FieldPolicy<any> | FieldReadFunction<any>,
	season?: FieldPolicy<any> | FieldReadFunction<any>,
	seasons?: FieldPolicy<any> | FieldReadFunction<any>,
	completedQuest?: FieldPolicy<any> | FieldReadFunction<any>,
	completedQuests?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedToken?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	stakingRewards?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	accounts?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	stakedTokenAccounts?: FieldPolicy<any> | FieldReadFunction<any>,
	questManager?: FieldPolicy<any> | FieldReadFunction<any>,
	questManagers?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPaidTransaction?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardPaidTransactions?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>,
	_meta?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TokenKeySpecifier = ('id' | 'address' | 'decimals' | 'name' | 'symbol' | 'totalSupply' | 'totalBurned' | 'totalMinted' | 'totalTransfers' | 'totalMints' | 'totalBurns' | TokenKeySpecifier)[];
export type TokenFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	decimals?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	symbol?: FieldPolicy<any> | FieldReadFunction<any>,
	totalSupply?: FieldPolicy<any> | FieldReadFunction<any>,
	totalBurned?: FieldPolicy<any> | FieldReadFunction<any>,
	totalMinted?: FieldPolicy<any> | FieldReadFunction<any>,
	totalTransfers?: FieldPolicy<any> | FieldReadFunction<any>,
	totalMints?: FieldPolicy<any> | FieldReadFunction<any>,
	totalBurns?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionKeySpecifier = ('id' | 'hash' | 'block' | 'timestamp' | 'sender' | TransactionKeySpecifier)[];
export type TransactionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	hash?: FieldPolicy<any> | FieldReadFunction<any>,
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	sender?: FieldPolicy<any> | FieldReadFunction<any>
};
export type _Block_KeySpecifier = ('hash' | 'number' | _Block_KeySpecifier)[];
export type _Block_FieldPolicy = {
	hash?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>
};
export type _Meta_KeySpecifier = ('block' | 'deployment' | 'hasIndexingErrors' | _Meta_KeySpecifier)[];
export type _Meta_FieldPolicy = {
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	deployment?: FieldPolicy<any> | FieldReadFunction<any>,
	hasIndexingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Account?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountKeySpecifier | (() => undefined | AccountKeySpecifier),
		fields?: AccountFieldPolicy,
	},
	CompletedQuest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CompletedQuestKeySpecifier | (() => undefined | CompletedQuestKeySpecifier),
		fields?: CompletedQuestFieldPolicy,
	},
	Counter?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CounterKeySpecifier | (() => undefined | CounterKeySpecifier),
		fields?: CounterFieldPolicy,
	},
	Metric?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MetricKeySpecifier | (() => undefined | MetricKeySpecifier),
		fields?: MetricFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Quest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestKeySpecifier | (() => undefined | QuestKeySpecifier),
		fields?: QuestFieldPolicy,
	},
	QuestManager?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestManagerKeySpecifier | (() => undefined | QuestManagerKeySpecifier),
		fields?: QuestManagerFieldPolicy,
	},
	RewardPaidTransaction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RewardPaidTransactionKeySpecifier | (() => undefined | RewardPaidTransactionKeySpecifier),
		fields?: RewardPaidTransactionFieldPolicy,
	},
	Season?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SeasonKeySpecifier | (() => undefined | SeasonKeySpecifier),
		fields?: SeasonFieldPolicy,
	},
	StakedToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StakedTokenKeySpecifier | (() => undefined | StakedTokenKeySpecifier),
		fields?: StakedTokenFieldPolicy,
	},
	StakedTokenAccount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StakedTokenAccountKeySpecifier | (() => undefined | StakedTokenAccountKeySpecifier),
		fields?: StakedTokenAccountFieldPolicy,
	},
	StakedTokenBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StakedTokenBalanceKeySpecifier | (() => undefined | StakedTokenBalanceKeySpecifier),
		fields?: StakedTokenBalanceFieldPolicy,
	},
	StakingRewards?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StakingRewardsKeySpecifier | (() => undefined | StakingRewardsKeySpecifier),
		fields?: StakingRewardsFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	Token?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TokenKeySpecifier | (() => undefined | TokenKeySpecifier),
		fields?: TokenFieldPolicy,
	},
	Transaction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionKeySpecifier | (() => undefined | TransactionKeySpecifier),
		fields?: TransactionFieldPolicy,
	},
	_Block_?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | _Block_KeySpecifier | (() => undefined | _Block_KeySpecifier),
		fields?: _Block_FieldPolicy,
	},
	_Meta_?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | _Meta_KeySpecifier | (() => undefined | _Meta_KeySpecifier),
		fields?: _Meta_FieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;