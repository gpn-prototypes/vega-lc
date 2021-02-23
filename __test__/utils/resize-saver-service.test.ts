import { ResizeSaverService } from '../../src/utils/resize-saver-service';

describe('ResizeSaverService', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  test('Сохраняет и выдает параметры с установленным id', () => {
    const resizeSaver = new ResizeSaverService();

    const id = 'test-id';

    resizeSaver.setId(id);

    resizeSaver.setGridSize({ height: 1, width: 1 });

    expect(resizeSaver.getGridSize().height).toStrictEqual('1px');
    expect(resizeSaver.getGridSize().width).toStrictEqual('1px');
  });

  test('Выдает дефолтные параметры для SplitPanes, если нет установленных в storage', () => {
    const resizeSaver = new ResizeSaverService();

    resizeSaver.setId(undefined);

    const gridParams = resizeSaver.getGridSize();

    expect(gridParams.width).toStrictEqual('260px');
    expect(gridParams.height).toBeUndefined();
  });
});
