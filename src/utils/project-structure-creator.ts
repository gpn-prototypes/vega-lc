import { TreeItem } from '@gpn-prototypes/vega-ui';

// eslint-disable-next-line camelcase
import { GeoEconomicAppraisalProject_Type } from '@/generated/graphql-project';

// eslint-disable-next-line camelcase
type GeoEconomicAppraisalProject = GeoEconomicAppraisalProject_Type;

export const nodeListCreator = (
  geoEconomicAppraisalProject: GeoEconomicAppraisalProject | GeoEconomicAppraisalProject[],
): TreeItem[] => {
  const source = Array.isArray(geoEconomicAppraisalProject)
    ? geoEconomicAppraisalProject
    : [geoEconomicAppraisalProject];

  const collection: { [x: string]: TreeItem } = {};

  source.forEach((project) => {
    const { vid } = project;

    if (!collection[vid]) {
      collection[vid] = {
        name: project.name || 'root object',
        id: project.vid,
        nodeList: [],
        iconId: 'blue-line',
        isDropZone: false,
        isDraggable: false,
      };
    }

    if (Array.isArray(project.licensingRounds)) {
      project.licensingRounds.forEach((object: any) => {
        collection[vid].nodeList.push({
          name: object.name,
          id: object.vid,
          iconId: 'orange-line',
          nodeList:
            object.geoEconomicAppraisalProject &&
            nodeListCreator(object.geoEconomicAppraisalProject),
        });
      });
    }
  });

  return Object.values(collection);
};
