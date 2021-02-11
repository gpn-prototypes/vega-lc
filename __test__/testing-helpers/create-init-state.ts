import ActivitiesInitState from '../../src/redux-store/activities/initial-state';
import GroupObjectsInitState from '../../src/redux-store/group-objects/initial-state';
import LogicConstructorInitState from '../../src/redux-store/logic-constructor/initial-state';
import NotificationInitState from '../../src/redux-store/notifications/initial-state';
import ProjectStructureInitState from '../../src/redux-store/project-structure/initial-state';
import VersionInitState from '../../src/redux-store/version/initial-state';
import { StoreLC } from '../../src/types/redux-store';

export const createInitState = (modifier?: Partial<StoreLC>): StoreLC => {
  let initState: StoreLC = {
    activities: ActivitiesInitState,
    groupObjects: GroupObjectsInitState,
    projectStructure: ProjectStructureInitState,
    logicConstructor: LogicConstructorInitState,
    version: VersionInitState,
    notifications: NotificationInitState,
  };

  if (modifier) {
    initState = {
      ...initState,
      ...modifier,
    };
  }

  return initState;
};
