import {
  ApolloClient,
  DocumentNode,
  FetchPolicy,
  MutationOptions,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
} from '@apollo/client';

import {
  ACTIVITY_LIST_QUERY,
  CANVAS_NODE_CREATE_MUTATION,
  CANVAS_NODE_DELETE_MUTATION,
  CANVAS_NODE_UPDATE_MUTATION,
  GROUP_OBJECT_LIST_QUERY,
  OBJECT_GROUP_CREATE_MUTATION,
  OBJECT_GROUP_UPDATE_MUTATION,
  PROJECT_STRUCTURE_QUERY,
  SCENARIO_STEP_CREATE_MUTATION,
  SCENARIO_STEP_DELETE_MUTATION,
  SCENARIO_STEP_UPDATE_MUTATION,
} from '../queries';

import { config } from '@/config/config.public';
import { Identity } from '@/types';

export type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface ObjectGroupUpdateMutationVariables {
  vids: string[];
  vid: string;
  version?: number;
}

export interface ObjectGroupCreateMutationVariables {
  name: string;
  version?: number;
}

export interface DeleteCanvasNodeMutationVariables {
  vid: string;
  version?: number;
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

export interface CreateCanvasNodeMutationVariables {
  vid?: string;
  title?: string;
  width?: number;
  nodeType: string;
  nodeRef?: string;
  version?: number;
  position?: number[];
}

export interface ScenarioStepUpdateMutationVariables {
  vid: string;
  name?: string;
  activity?: string;
  objectGroup?: string;
  objects?: string[];
  version?: number;
}

export interface ScenarioStepCreateMutationVariables {
  name?: string;
  activity?: string;
  objectGroup?: string;
  objects?: string[];
  version?: number;
}

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

class LogicConstructorService {
  private _client: ApolloClient<NormalizedCacheObject> | undefined;

  private _projectId = '';

  private _identity: Identity | undefined;

  private _fetchPolicy: FetchPolicy = 'no-cache';

  private _projectVersion = 1;

  private _isMutationConflict = false;

  get client() {
    return this._client;
  }

  get isMutationConflict() {
    return this._isMutationConflict;
  }

  get projectId() {
    return this._projectId;
  }

  get projectVersion() {
    return this._projectVersion;
  }

  get identity() {
    return this._identity;
  }

  get fetchPolicy() {
    return this._fetchPolicy;
  }

  setIsMutationConflictResolved() {
    this._isMutationConflict = false;
  }

  setProjectVersion(version: number | undefined) {
    if (typeof version === 'number') {
      this._projectVersion = version;
    }
  }

  public getGraphQlUri() {
    return `${config.baseApiUrl}/graphql/${this.projectId}`;
  }

  incrementVersion() {
    if (this._projectVersion) {
      this._projectVersion += 1;
    }
  }

  init({ client, identity, projectId }: ServiceInitProps): void {
    this._client = client;
    this._identity = identity;
    this._projectId = projectId;
  }

  query(body: DocumentNode, projectQuery?: boolean, options?: Partial<QueryOptions>) {
    let request: QueryOptions = {
      ...options,
      query: body,
    };

    if (projectQuery) {
      request = {
        ...request,
        context: {
          uri: this.getGraphQlUri(),
        },
        fetchPolicy: this._fetchPolicy,
      };
    }

    return this.client?.query(request);
  }

  async mutation(body: DocumentNode, variables: OperationVariables) {
    const request: MutationOptions = {
      mutation: body,
      variables: { version: this.projectVersion, ...variables },
      context: {
        uri: this.getGraphQlUri(),
        projectDiffResolving: this.getDiffResolvingConfig(),
      },
    };

    try {
      const response = await this.client?.mutate(request);

      if (response?.errors) {
        return undefined;
      }

      this.incrementVersion();

      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  public projectStructureQuery() {
    return this.query(PROJECT_STRUCTURE_QUERY, false, {
      fetchPolicy: this._fetchPolicy,
      variables: {
        projectId: this.projectId,
      },
    });
  }

  public activityListQuery() {
    return this.query(ACTIVITY_LIST_QUERY);
  }

  public groupObjectListQuery() {
    return this.query(GROUP_OBJECT_LIST_QUERY, true);
  }

  public objectGroupUpdateMutation(variables: ObjectGroupUpdateMutationVariables) {
    return this.mutation(OBJECT_GROUP_UPDATE_MUTATION, variables);
  }

  public objectGroupCreateMutation(variables: ObjectGroupCreateMutationVariables) {
    return this.mutation(OBJECT_GROUP_CREATE_MUTATION, variables);
  }

  public scenarioStepCreateMutation(variables: ScenarioStepCreateMutationVariables) {
    return this.mutation(SCENARIO_STEP_CREATE_MUTATION, variables);
  }

  public scenarioStepUpdateMutation(variables: ScenarioStepUpdateMutationVariables) {
    return this.mutation(SCENARIO_STEP_UPDATE_MUTATION, variables);
  }

  public scenarioStepDeleteMutation(variables: ScenarioStepUpdateMutationVariables) {
    return this.mutation(SCENARIO_STEP_DELETE_MUTATION, variables);
  }

  public canvasNodeCreateMutation(variables: CreateCanvasNodeMutationVariables) {
    return this.mutation(CANVAS_NODE_CREATE_MUTATION, variables);
  }

  public canvasNodeUpdateMutation(variables: UpdateCanvasNodeMutationVariables) {
    return this.mutation(CANVAS_NODE_UPDATE_MUTATION, variables);
  }

  public canvasNodeDeleteMutation(variables: DeleteCanvasNodeMutationVariables) {
    return this.mutation(CANVAS_NODE_DELETE_MUTATION, variables);
  }

  public getDiffResolvingConfig() {
    return {
      maxAttempts: 20,
      errorTypename: 'UpdateProjectInnerDiff',
      mergeStrategy: {
        default: 'smart',
      },
      projectAccessor: {
        fromDiffError: (data: Record<string, unknown>) => ({
          remote: data.remoteProject,
          local: {
            vid: this.projectId,
            version: this.projectVersion,
          },
        }),
        fromVariables: (vars: Record<string, any>) => ({
          ...vars,
        }),
        toVariables: (vars: Record<string, unknown>, patched: Record<string, any>) => {
          this.setProjectVersion(patched.version);
          this._isMutationConflict = true;

          return {
            ...vars,
            ...patched,
            vid: vars.vid,
            version: patched.version,
          };
        },
      },
    };
  }
}

export const logicConstructorService = new LogicConstructorService();
