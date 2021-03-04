import React, { useEffect, useState } from 'react';

import { ShellToolkit } from '@/types';
import { logicConstructorService } from '@/utils/lc-service';

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

  const projectId = currentProject?.get()?.vid || '';4
  const projectVersion = currentProject?.get()?.version || 1;

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    logicConstructorService.init({
      client: graphqlClient,
      projectId,
      projectVersion,
      identity,
    });

    setInitialized(true);
  }, [identity, graphqlClient, projectId, projectVersion]);

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
