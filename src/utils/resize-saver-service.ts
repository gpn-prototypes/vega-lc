import { SplitPanesGridParams } from '@/types/redux-store';

type Size = {
  width: number;
  height: number;
};

class ResizeSaverService {
  private id = '';

  public setId(id: string) {
    this.id = id;
  }

  private get storageName(): string {
    if (this.id) {
      return `split-pane-grid-params-${this.id}`;
    }

    return 'split-pane-grid-params';
  }

  public setGridSize = (size: Size) => {
    sessionStorage.setItem(this.storageName, JSON.stringify(size));
  };

  public getGridSize = (): SplitPanesGridParams => {
    const rawGridParams = sessionStorage.getItem(this.storageName);

    if (rawGridParams) {
      const gridParams = JSON.parse(rawGridParams);

      return {
        width: `${gridParams.width}px`,
        height: `${gridParams.height}px`,
      };
    }

    return {
      width: '260px',
      height: undefined,
    };
  };
}

export const resizeSaverService = new ResizeSaverService();
