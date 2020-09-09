import React, { useRef, useState } from 'react';
import {
  Canvas,
  CanvasData,
  CanvasTree,
  CanvasUpdate,
  Change,
  entities,
} from '@gpn-prototypes/vega-canvas';
import { useInterval, useLocalStorage } from '@gpn-prototypes/vega-hooks';

const startNode = entities.Tree.of<CanvasData>({
  data: {
    position: { x: 10, y: 300 },
    title: 'Начало',
    type: 'root',
  },
});
const endNode = entities.Tree.of<CanvasData>({
  data: {
    position: { x: 600, y: 300 },
    title: 'Конец',
    type: 'end',
  },
});

const defaultTreeState: CanvasTree[] = [startNode, endNode];

export const CanvasWidget = (): React.ReactElement => {
  // initialState на самом деле опционален и должен браться из api
  // тут он указан только для примера
  // если initialState будет меняться, то это будет приводить к переинициализации grid'а,
  // поэтому следует этого по возможности избегать
  // const initialState = useMemo(() => ({}), []);
  // const [widgets, setWidgets] = useState([]);

  // useEffect(() => {
  //   // fetchWidgets().then((widgets) => setWidgets(widgets));
  // }, []);

  // const handleChange = ({ state }) => {
  //   // saveLayoutToBackend(state);
  //   console.log(state)
  // };
  const [treeState, setTreeState] = useLocalStorage<CanvasTree[]>('treeState', defaultTreeState);
  const [localState, setLocalState] = useState(treeState);
  const [changes, setChanges] = useState<CanvasUpdate[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useInterval(500, () => {
    if (changes.length) {
      setTreeState(localState);
      setChanges([]);
    }
  });

  const updateTree = (change: Change): void => {
    setChanges([...changes, change.update]);
    setLocalState(change.state);
  };

  return <Canvas parentRef={ref} state={localState} onChange={updateTree} />;
};
