import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconClose, Modal, Switch, TextField, usePortal } from '@gpn-prototypes/vega-ui';

import {
  createNewGroup,
  setNewGroupParams,
  toggleDialog,
} from '../../redux-store/group-objects/actions';
import { getIsDialogOpened, getNewGroupParams } from '../../redux-store/group-objects/selectors';

import { cnObjectGroup } from './cn-objects-group';

export const ObjectsGroupDialog: React.FC = () => {
  const dispatch = useDispatch();

  const { portal } = usePortal({ name: 'modalRoot' });

  const isDialogOpen = useSelector(getIsDialogOpened);
  const { name, isDynamic } = useSelector(getNewGroupParams);

  const handleChangeName = (args: { value: string | null }): void => {
    if (args.value?.search(/\s/g) === 0) {
      return;
    }

    dispatch(setNewGroupParams({ isDynamic, name: args.value || '' }));
  };

  const handleToggleDynamicGroup = ({ checked }: { checked: boolean }): void => {
    dispatch(setNewGroupParams({ isDynamic: checked, name }));
  };

  const handleCloseDialog = (): void => {
    dispatch(toggleDialog(false));
    dispatch(setNewGroupParams({ isDynamic: false, name: '' }));
  };

  const handleCreateObjectGroup = (): void => {
    if (!name) {
      return;
    }

    dispatch(createNewGroup(name));
    handleCloseDialog();
  };

  return (
    <Modal
      className={cnObjectGroup('Dialog')}
      portal={portal}
      isOpen={isDialogOpen}
      onClose={handleCloseDialog}
      hasOverlay
    >
      <div className={cnObjectGroup('DialogContent')}>
        <h4 className={cnObjectGroup('DialogTitle')}>Название группы</h4>

        <p className={cnObjectGroup('DialogInputLabel').toString()}>Название</p>

        <TextField
          onChange={handleChangeName}
          autoFocus
          value={name}
          className={cnObjectGroup('DialogInput').toString()}
          width="full"
        />

        <div className={cnObjectGroup('DialogControllers')}>
          <div className={cnObjectGroup('DialogDynamicGroupSwitcher')}>
            <Switch
              size="m"
              onChange={handleToggleDynamicGroup}
              checked={isDynamic}
              label="Динамическая"
            />
          </div>

          <div className={cnObjectGroup('DialogButtons')}>
            <Button onClick={handleCreateObjectGroup} size="s" label="Создать группу" />
            <Button onClick={handleCloseDialog} size="s" view="ghost" label="Отмена" />
          </div>
        </div>

        <button onClick={handleCloseDialog} className={cnObjectGroup('DialogCloser')} type="button">
          <IconClose size="s" />
        </button>
      </div>
    </Modal>
  );
};
