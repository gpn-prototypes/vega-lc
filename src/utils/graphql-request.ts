import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { getHeaders } from './headers';
import { getProjectId } from './project-id';
import {
  ACTIVITY_LIST_QUERY,
  CANVAS_NODE_CREATE_MUTATION,
  CANVAS_NODE_UPDATE_MUTATION,
  GROUP_OBJECT_LIST_QUERY,
  OBJECT_GROUP_CREATE_MUTATION,
  OBJECT_GROUP_UPDATE_MUTATION,
  PROJECT_QUERY,
  SCENARIO_STEP_CREATE_MUTATION,
  SCENARIO_STEP_UPDATE_MUTATION,
} from './queries';
import { getCurrentVersion, incrementVersion } from './version';

import { config } from '@/config.public';
import { Identity } from '@/types';

export type QueryBody = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; appendProjectId?: boolean; isMutation?: boolean };
type ResponseProp = { [key: string]: any };

export const getGraphqlUri = (projectId: string): string =>
  `${config.baseApiUrl}/graphql/${projectId}`;

export interface ServiceConfig {
  client?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  projectId: string;
}

export const serviceConfig: ServiceConfig = {
  projectId: '',
};

export function initServiceConfig({ client, identity, projectId }: ServiceConfig): void {
  serviceConfig.client = client;
  serviceConfig.identity = identity;
  serviceConfig.projectId = projectId;
}

export function activityListQuery() {
  return serviceConfig.client?.query({
    query: ACTIVITY_LIST_QUERY,
  });
}

export function groupObjectListQuery() {
  return serviceConfig.client?.query({
    query: GROUP_OBJECT_LIST_QUERY,
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
}

export interface ObjectGroupUpdateMutationVariables {
  vids: string[];
  vid: string;
  version?: number;
}

export function objectGroupUpdateMutation(variables: ObjectGroupUpdateMutationVariables) {
  return serviceConfig.client?.mutate({
    mutation: OBJECT_GROUP_UPDATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
}

export interface ObjectGroupCreateMutationVariables {
  name: string;
  version?: number;
}

export function objectGroupCreateMutation(variables: ObjectGroupCreateMutationVariables) {
  return serviceConfig.client?.mutate({
    mutation: OBJECT_GROUP_CREATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
}

export interface ScenarioStepCreateMutationVariables {
  name?: string;
  activity?: string;
  objectGroup?: string;
  objects?: string[];
  version?: number;
}

export function scenarioStepCreateMutation(variables: ScenarioStepCreateMutationVariables) {
  return serviceConfig.client?.mutate({
    mutation: SCENARIO_STEP_CREATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
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
  return serviceConfig.client?.mutate({
    mutation: SCENARIO_STEP_UPDATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
}

export interface CreateCanvasNodeMutationVariables {
  title?: string;
  width?: number;
  nodeType: string;
  nodeRef?: string;
  version?: number;
  position?: number[];
}

export function canvasNodeCreateMutation(variables: CreateCanvasNodeMutationVariables) {
  return serviceConfig.client?.mutate({
    mutation: CANVAS_NODE_CREATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
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
  return serviceConfig.client?.mutate({
    mutation: CANVAS_NODE_UPDATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
}

export interface DeleteCanvasNodeMutationVariables {
  vid: string;
  version?: number;
}

export function canvasNodeDeleteMutation(variables: DeleteCanvasNodeMutationVariables) {
  return serviceConfig.client?.mutate({
    mutation: CANVAS_NODE_UPDATE_MUTATION,
    variables: { version: getCurrentVersion(), ...variables },
    context: {
      uri: getGraphqlUri(serviceConfig.projectId),
    },
  });
}

export function projectQuery() {
  return serviceConfig.client?.query({
    query: PROJECT_QUERY,
    variables: {
      projectId: serviceConfig.projectId,
    },
  });
}

export function graphQlRequest({
  body,
  appendProjectId = false,
  isMutation = false,
}: GraphqlRequestProps): Promise<{ data: ResponseProp; errors?: ResponseProp }> {
  const uri = appendProjectId ? `graphql/${getProjectId()}` : 'graphql';

  return new Promise((resolve, reject) => {
    fetch(`${config.baseApiUrl}/${uri}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
      .then(async (resp) => {
        const parsedResponse = await resp.json();

        if (resp.ok && !parsedResponse.errors) {
          if (isMutation) incrementVersion();

          resolve(parsedResponse);
        } else {
          throw new Error(parsedResponse.errors || 'Request failed');
        }
      })
      .catch(reject);
  });
}
