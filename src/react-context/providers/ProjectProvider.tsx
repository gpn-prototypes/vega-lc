import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { defaultTo } from 'lodash';

import { Identity } from '@/types';
import { initServiceConfig } from '@/utils/graphql-request';

const ROUTE_MATCH_PROJECT_ID = '/projects/show/:projectId';

type MatchedData = { projectId: string };

export interface ProjectContextData {
  projectId: string;
  initialized: boolean;
}

const ProjectContext = React.createContext<ProjectContextData>({
  projectId: '',
  initialized: false,
});

interface ProjectProviderProps {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

const ProjectProvider: React.FC<ProjectProviderProps> = ({ children, graphqlClient, identity }) => {
  const matchedData = defaultTo<MatchedData>(
    useRouteMatch<MatchedData>(ROUTE_MATCH_PROJECT_ID)?.params,
    {
      projectId: '',
    },
  );

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initServiceConfig({
      client: graphqlClient,
      projectId: matchedData.projectId,
      identity,
    });
    setInitialized(true);
  }, [identity, graphqlClient, matchedData]);

  return (
    <ProjectContext.Provider
      value={{
        ...matchedData,
        initialized,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
