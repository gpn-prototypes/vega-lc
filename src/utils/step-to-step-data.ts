import { Content, Event, Step, StepData } from '../types/redux-store';

export function stepToStepData(step: Step): StepData {
  const events = [] as Event[];

  step.itemList.forEach((item) => {
    const eventContent =
      item.object &&
      ({
        id: item.object.vid,
        name: item.object.name,
        type: 'domain',
      } as Content);

    if (!item.activity) return;

    const exisingEvent = events.find((event) => event.id === item.activity?.activityType.vid);

    if (!exisingEvent) {
      events.push({
        id: item.activity.activityType.vid,
        name: item.activity.name,
        content: [eventContent],
      } as Event);
    } else if (eventContent) {
      exisingEvent.content.push(eventContent);
    }
  });

  return {
    id: step.vid,
    name: step.name,
    events,
  } as StepData;
}
