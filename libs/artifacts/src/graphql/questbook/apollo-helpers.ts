import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type MutationKeySpecifier = ('updateQuest' | 'updateQuests' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	updateQuest?: FieldPolicy<any> | FieldReadFunction<any>,
	updateQuests?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('quests' | 'quest' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	quests?: FieldPolicy<any> | FieldReadFunction<any>,
	quest?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestKeySpecifier = ('id' | 'ethereumId' | 'objectives' | 'title' | 'description' | 'imageURI' | 'userQuest' | QuestKeySpecifier)[];
export type QuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ethereumId?: FieldPolicy<any> | FieldReadFunction<any>,
	objectives?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	imageURI?: FieldPolicy<any> | FieldReadFunction<any>,
	userQuest?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestObjectiveKeySpecifier = ('id' | 'points' | 'title' | 'description' | QuestObjectiveKeySpecifier)[];
export type QuestObjectiveFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	points?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserQuestKeySpecifier = ('id' | 'complete' | 'progress' | 'signature' | 'objectives' | UserQuestKeySpecifier)[];
export type UserQuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	complete?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	signature?: FieldPolicy<any> | FieldReadFunction<any>,
	objectives?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserQuestObjectiveKeySpecifier = ('id' | 'complete' | 'progress' | UserQuestObjectiveKeySpecifier)[];
export type UserQuestObjectiveFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	complete?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
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
	QuestObjective?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestObjectiveKeySpecifier | (() => undefined | QuestObjectiveKeySpecifier),
		fields?: QuestObjectiveFieldPolicy,
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