import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export interface Identity {
  getToken(): Promise<string>;
}

type ProjectVID = string;

interface Project {
  vid: ProjectVID;
}

export interface CurrentProject {
  get(): Project;
}

export interface ShellToolkit {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  currentProject?: CurrentProject;
}
