import { Content, Event, Step, StepData } from '../types/redux-store';

export function getStepDataFromScenarioStep(step: Step): StepData {
  const events = [] as Event[];

  step.itemList.forEach((item) => {
    const eventContent =
      item.object &&
      ({
        id: item.object.vid,
        name: item.object.name,
        type: 'domain',
      } as Content);

    const existingEvent = events.find(
      (event) => event.id === (item.activity?.activityType.vid || '0'),
    );

    if (!existingEvent) {
      const id = item.activity?.activityType.vid || '0';
      const name = item.activity?.name || 'Мероприятие';
      events.push({
        id,
        name,
        content: eventContent ? [eventContent] : [],
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
