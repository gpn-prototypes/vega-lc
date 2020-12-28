import { ApolloClient, FetchPolicy, NormalizedCacheObject } from '@apollo/client';
import { ApolloQueryResult } from '@apollo/client/core/types';

import {
  ACTIVITY_LIST_QUERY,
  CANVAS_NODE_CREATE_MUTATION,
  CANVAS_NODE_DELETE_MUTATION,
  CANVAS_NODE_UPDATE_MUTATION,
  GROUP_OBJECT_LIST_QUERY,
  OBJECT_GROUP_CREATE_MUTATION,
  OBJECT_GROUP_UPDATE_MUTATION,
  PROJECT_QUERY,
  SCENARIO_STEP_CREATE_MUTATION,
  SCENARIO_STEP_DELETE_MUTATION,
  SCENARIO_STEP_UPDATE_MUTATION,
} from './queries';
import { getCurrentVersion, incrementVersion, setCurrentVersion } from './version';

import { config } from '@/config.public';
import { Identity } from '@/types';

type QueryResult = Promise<ApolloQueryResult<any>> | undefined;

export type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const getGraphqlUri = (projectId: string): string =>
  `${config.baseApiUrl}/graphql/${projectId}`;

export interface ServiceConfig {
  client?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  projectId: string;
  fetchPolicy: FetchPolicy;
  getDiffResolvingConfig: () => Data;
}

export interface ServiceInitProps {
  client?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  projectId: string;
}

export const serviceConfig: ServiceConfig = {
  projectId: '',
  fetchPolicy: 'no-cache',
  getDiffResolvingConfig: () => ({
    maxAttempts: 20,
    errorTypename: 'UpdateProjectInnerDiff',
    mergeStrategy: {
      default: 'smart',
    },
    projectAccessor: {
      fromDiffError: (data: Record<string, unknown>) => ({
        remote: data.remoteProject,
        local: {
          vid: serviceConfig.projectId,
          version: getCurrentVersion(),
        },
      }),
      fromVariables: (vars: Record<string, any>) => ({
        ...vars,
      }),
      toVariables: (vars: Record<string, unknown>, patched: Record<string, any>) => {
        setCurrentVersion(patched.version);

        return {
          ...vars,
          ...patched,
          vid: vars.vid,
          version: patched.version,
        };
      },
    },
  }),
};

export function initServiceConfig({ client, identity, projectId }: ServiceInitProps): void {
  serviceConfig.client = client;
  serviceConfig.identity = identity;
  serviceConfig.projectId = projectId;
}

export function activityListQuery(): QueryResult {
  return serviceConfig.client?.query({
    query: ACTIVITY_LIST_QUERY,
  });
}

async function versionModifier<T>(action: Promise<T> | undefined): Promise<T | undefined> {
  if (action) {
    const result = await action;
    incrementVersion();
    return result;
  }
  return undefined;
}

export function groupObjectListQuery(): QueryResult {
  return serviceConfig.client?.query({
    query: GROUP_OBJECT_LIST_QUERY,
    fetchPolicy: serviceConfig.fetchPolicy,
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
      projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
    },
  });
}

export interface ObjectGroupUpdateMutationVariables {
  vids: string[];
  vid: string;
  version?: number;
}

export function objectGroupUpdateMutation(variables: ObjectGroupUpdateMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: OBJECT_GROUP_UPDATE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface ObjectGroupCreateMutationVariables {
  name: string;
  version?: number;
}

export function objectGroupCreateMutation(variables: ObjectGroupCreateMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: OBJECT_GROUP_CREATE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface ScenarioStepCreateMutationVariables {
  name?: string;
  activity?: string;
  objectGroup?: string;
  objects?: string[];
  version?: number;
}

export function scenarioStepCreateMutation(variables: ScenarioStepCreateMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: SCENARIO_STEP_CREATE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface ScenarioStepUpdateMutationVariables {
  vid: string;
  name?: string;
  activity?: string;
  objectGroup?: string;
  objects?: string[];
  version?: number;
}

export function scenarioStepUpdateMutation(variables: ScenarioStepUpdateMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: SCENARIO_STEP_UPDATE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface CreateCanvasNodeMutationVariables {
  vid?: string;
  title?: string;
  width?: number;
  nodeType: string;
  nodeRef?: string;
  version?: number;
  position?: number[];
}

export function canvasNodeCreateMutation(variables: CreateCanvasNodeMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: CANVAS_NODE_CREATE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface UpdateCanvasNodeMutationVariables {
  vid: string;
  title?: string;
  width?: number;
  nodeType?: string;
  nodeRef?: string;
  version?: number;
  childrenVids?: string[];
  parentVids?: string[];
  position?: (number | undefined)[];
}

export function canvasNodeUpdateMutation(variables: UpdateCanvasNodeMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: CANVAS_NODE_UPDATE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface DeleteCanvasNodeMutationVariables {
  vid: string;
  version?: number;
}

export function canvasNodeDeleteMutation(variables: DeleteCanvasNodeMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: CANVAS_NODE_DELETE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
        projectDiffResolving: serviceConfig.getDiffResolvingConfig(),
      },
    }),
  );
}

export interface DeleteScenarioStepMutationVariables {
  vid: string;
  version?: number;
}

export function scenarioStepDeleteMutation(variables: DeleteScenarioStepMutationVariables) {
  return versionModifier(
    serviceConfig.client?.mutate({
      mutation: SCENARIO_STEP_DELETE_MUTATION,
      variables: { version: getCurrentVersion(), ...variables },
      context: {
        uri: getGraphqlUri(serviceConfig.projectId),
      },
    }),
  );
}

export function projectQuery(): QueryResult {
  return serviceConfig.client?.query({
    query: PROJECT_QUERY,
    fetchPolicy: serviceConfig.fetchPolicy,
    variables: {
      projectId: serviceConfig.projectId,
    },
  });
}
