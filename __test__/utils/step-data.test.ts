import { Step, StepData } from '../../src/types/redux-store';
import { getStepDataFromScenarioStep } from '../../src/utils/step-data';

describe('Функция получения данных по шагу в формате для Канваса из Шага сценария с сервера', () => {
  const activityTestName = 'test-activity-name';
  const activityTestVid = 'test-activity-vid';

  const objectTestName = 'test-object-name';
  const objectTestVid = 'test-object-vid';

  const anotherObjectTestName = 'another-test-object-name';
  const anotherObjectTestVid = 'another-test-object-vid';

  const mockedScenarioStepData: Step = {
    name: 'test-name',
    vid: 'test-vid',
    itemList: [
      {
        activity: {
          activityType: {
            vid: activityTestVid,
          },
          name: activityTestName,
        },
        object: {
          vid: objectTestVid,
          name: objectTestName,
        },
      },
      {
        activity: {
          activityType: {
            vid: activityTestVid,
          },
          name: activityTestName,
        },
        object: {
          vid: anotherObjectTestVid,
          name: anotherObjectTestName,
        },
      },
    ],
  };

  const expectedResultStepData = {
    id: mockedScenarioStepData.vid,
    name: mockedScenarioStepData.name,
    events: [
      {
        id: activityTestVid,
        name: activityTestName,
        content: [
          { id: objectTestVid, name: objectTestName, type: 'domain' },
          {
            id: anotherObjectTestVid,
            name: anotherObjectTestName,
            type: 'domain',
          },
        ],
      },
    ],
  };

  test('Корректно формируется StepData', () => {
    const canvasStepData: StepData = getStepDataFromScenarioStep(mockedScenarioStepData);

    expect(canvasStepData).toMatchObject(expectedResultStepData);
  });
});
