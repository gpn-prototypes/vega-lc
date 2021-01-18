import React from 'react';

import './index.css';

import { cnComponentHeader } from '@/components/components-header/cn-header';

type ComponentHeaderProps = {
  title: string;
};

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({ title }) => {
  return (
    <div className={cnComponentHeader()}>
      <p>{title}</p>
    </div>
  );
};
