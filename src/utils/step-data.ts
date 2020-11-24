import { Content, Event, Step, StepData } from '../types/redux-store';

export function getStepDataFromScenarioStep(step: Step): StepData {
  const events = [] as Event[];

  step.itemList.forEach((item) => {
    if (!item.activity) return;

    const eventContent =
      item.object &&
      ({
        id: item.object.vid,
        name: item.object.name,
        type: 'domain',
      } as Content);

    const existingEvent = events.find((event) => event.id === item.activity?.activityType.vid);

    if (!existingEvent) {
      events.push({
        id: item.activity.activityType.vid,
        name: item.activity.name,
        content: [eventContent],
      } as Event);
    } else if (eventContent) {
      existingEvent.content.push(eventContent);
    }
  });

  return {
    id: step.vid,
    name: step.name,
    events,
  } as StepData;
}
