import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type MutationKeySpecifier = ('queueOptIn' | 'queueOptOut' | 'setMetadata' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	queueOptIn?: FieldPolicy<any> | FieldReadFunction<any>,
	queueOptOut?: FieldPolicy<any> | FieldReadFunction<any>,
	setMetadata?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('quest' | 'quests' | 'user' | 'optInQueue' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	quest?: FieldPolicy<any> | FieldReadFunction<any>,
	quests?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	optInQueue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestKeySpecifier = ('id' | 'metadata' | 'submission' | QuestKeySpecifier)[];
export type QuestFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	submission?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestMetadataKeySpecifier = ('title' | 'description' | 'imageUrl' | QuestMetadataKeySpecifier)[];
export type QuestMetadataFieldPolicy = {
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	imageUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuestSubmissionKeySpecifier = ('complete' | 'progress' | 'signature' | 'quest' | 'user' | QuestSubmissionKeySpecifier)[];
export type QuestSubmissionFieldPolicy = {
	complete?: FieldPolicy<any> | FieldReadFunction<any>,
	progress?: FieldPolicy<any> | FieldReadFunction<any>,
	signature?: FieldPolicy<any> | FieldReadFunction<any>,
	quest?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'queueOptIn' | 'completed' | 'queue' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	queueOptIn?: FieldPolicy<any> | FieldReadFunction<any>,
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	queue?: FieldPolicy<any> | FieldReadFunction<any>
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
	QuestMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestMetadataKeySpecifier | (() => undefined | QuestMetadataKeySpecifier),
		fields?: QuestMetadataFieldPolicy,
	},
	QuestSubmission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuestSubmissionKeySpecifier | (() => undefined | QuestSubmissionKeySpecifier),
		fields?: QuestSubmissionFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	}
};