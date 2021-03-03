import React, { useEffect, useState } from 'react';

import { ShellToolkit } from '@/types';
import { initServiceConfig } from '@/utils/graphql-request';

export interface ProjectContextData {
  projectId: string;
  initialized: boolean;
}

const ProjectContext = React.createContext<ProjectContextData>({
  projectId: '',
  initialized: false,
});

const ProjectProvider: React.FC<ShellToolkit> = (props) => {
  const { children, graphqlClient, identity, currentProject } = props;

  const projectId = currentProject?.get()?.vid || '';

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initServiceConfig({
      client: graphqlClient,
      projectId,
      identity,
    });
    setInitialized(true);
  }, [identity, graphqlClient, projectId]);

  return (
    <ProjectContext.Provider
      value={{
        projectId,
        initialized,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
