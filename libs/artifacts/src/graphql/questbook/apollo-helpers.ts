import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type MutationKeySpecifier = ('updateQuest' | 'updateQuests' | 'queueOptIn' | 'queueOptOut' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	updateQuest?: FieldPolicy<any> | FieldReadFunction<any>,
	updateQuests?: FieldPolicy<any> | FieldReadFunction<any>,
	queueOptIn?: FieldPolicy<any> | FieldReadFunction<any>,
	queueOptOut?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('quests' | 'quest' | 'queue' | 'user' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	quests?: FieldPolicy<any> | FieldReadFunction<any>,
	quest?: FieldPolicy<any> | FieldReadFunction<any>,
	queue?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestKeySpecifier = ('id' | 'ethereumId' | 'requiredPoints' | 'objectives' | 'title' | 'description' | 'imageURI' | 'userQuest' | QuestKeySpecifier)[];
export type QuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ethereumId?: FieldPolicy<any> | FieldReadFunction<any>,
	requiredPoints?: FieldPolicy<any> | FieldReadFunction<any>,
	objectives?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	imageURI?: FieldPolicy<any> | FieldReadFunction<any>,
	userQuest?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestCompletionQueueItemKeySpecifier = ('ethereumId' | 'userId' | QuestCompletionQueueItemKeySpecifier)[];
export type QuestCompletionQueueItemFieldPolicy = {
	ethereumId?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestObjectiveKeySpecifier = ('id' | 'points' | 'title' | 'description' | QuestObjectiveKeySpecifier)[];
export type QuestObjectiveFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	points?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'optInQueue' | 'quests' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	optInQueue?: FieldPolicy<any> | FieldReadFunction<any>,
	quests?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserQuestKeySpecifier = ('id' | 'complete' | 'completedAt' | 'progress' | 'signature' | 'objectives' | UserQuestKeySpecifier)[];
export type UserQuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	complete?: FieldPolicy<any> | FieldReadFunction<any>,
	completedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	signature?: FieldPolicy<any> | FieldReadFunction<any>,
	objectives?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserQuestObjectiveKeySpecifier = ('id' | 'complete' | 'completedAt' | 'progress' | UserQuestObjectiveKeySpecifier)[];
export type UserQuestObjectiveFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	complete?: FieldPolicy<any> | FieldReadFunction<any>,
	completedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Quest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestKeySpecifier | (() => undefined | QuestKeySpecifier),
		fields?: QuestFieldPolicy,
	},
	QuestCompletionQueueItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestCompletionQueueItemKeySpecifier | (() => undefined | QuestCompletionQueueItemKeySpecifier),
		fields?: QuestCompletionQueueItemFieldPolicy,
	},
	QuestObjective?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestObjectiveKeySpecifier | (() => undefined | QuestObjectiveKeySpecifier),
		fields?: QuestObjectiveFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserQuest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserQuestKeySpecifier | (() => undefined | UserQuestKeySpecifier),
		fields?: UserQuestFieldPolicy,
	},
	UserQuestObjective?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserQuestObjectiveKeySpecifier | (() => undefined | UserQuestObjectiveKeySpecifier),
		fields?: UserQuestObjectiveFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;