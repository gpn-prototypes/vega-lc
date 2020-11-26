import React from 'react';
import { useRouteMatch } from 'react-router';
import { defaultTo } from 'lodash';

import { setProjectId } from '@/utils/project-id';

const ROUTE_MATCH_PROJECT_ID = '/projects/show/:projectId';

type MatchedData = { projectId: string };

const ProjectContext = React.createContext<MatchedData>({ projectId: '' });

const ProjectProvider: React.FC = ({ children }) => {
  const matchedData = defaultTo<MatchedData>(
    useRouteMatch<MatchedData>(ROUTE_MATCH_PROJECT_ID)?.params,
    {
      projectId: 'a3333333-b111-c111-d111-e00000000000',
    },
  );

  setProjectId(matchedData.projectId);

  return <ProjectContext.Provider value={matchedData}>{children}</ProjectContext.Provider>;
};

export { ProjectProvider, ProjectContext };
