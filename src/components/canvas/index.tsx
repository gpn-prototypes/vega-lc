import React, { useState } from 'react';
import {
  Canvas,
  CanvasData,
  CanvasTree,
  CanvasUpdate,
  Change,
  entities,
  useInterval,
  useLocalStorage,
} from '@gpn-prototypes/vega-ui';

import './index.css';

type CanvasWidgetProps = {
  parentRef: React.RefObject<HTMLElement>;
};

export const CanvasWidget: React.FC<CanvasWidgetProps> = (props) => {
  const { parentRef } = props;
  const { Tree } = entities;

  const startNode = Tree.of<CanvasData>({
    data: {
      position: { x: 450, y: 400 },
      title: 'Начало',
      type: 'root',
    },
  });

  const endNode = Tree.of<CanvasData>({
    data: {
      position: { x: 900, y: 400 },
      title: 'Конец',
      type: 'end',
    },
  });

  const defaultTreeState: CanvasTree[] = [startNode, endNode];

  const [treeState, setTreeState] = useLocalStorage<CanvasTree[]>('treeState', defaultTreeState);
  const [localState, setLocalState] = useState(treeState);
  const [changes, setChanges] = useState<CanvasUpdate[]>([]);

  useInterval(500, () => {
    if (changes.length) {
      setTreeState(localState);
      setChanges([]);
    }
  });

  const updateTree = (change: Change): void => {
    if (change.update.type === 'clear') {
      setLocalState([]);
      setTreeState([]);
      return;
    }
    setChanges([...changes, change.update]);
    setLocalState(change.state);
  };

  return <Canvas parentRef={parentRef} state={localState} onChange={updateTree} />;
};
