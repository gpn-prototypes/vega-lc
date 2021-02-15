import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  IconClose,
  Modal,
  Switch,
  Text,
  TextField,
  usePortal,
} from '@gpn-prototypes/vega-ui';

import { cnObjectGroup } from './cn-objects-group';

import {
  createNewGroup,
  setNewGroupParams,
  toggleDialog,
} from '@/redux-store/group-objects/actions';
import {
  getGroupObjectsNodeList,
  getIsDialogOpened,
  getNewGroupParams,
} from '@/redux-store/group-objects/selectors';

export const ObjectsGroupDialog: React.FC = () => {
  const dispatch = useDispatch();

  const { portal } = usePortal({ name: 'modalRoot' });
  const textFieldRef = useRef<HTMLInputElement | null>(null);

  const isDialogOpen = useSelector(getIsDialogOpened);
  const { name, isDynamic } = useSelector(getNewGroupParams);
  const existingGroupObjects = useSelector(getGroupObjectsNodeList);

  const [error, setError] = useState('');

  const handleChangeName = (args: { value: string | null }): void => {
    setError('');

    if (args.value?.search(/\s/g) === 0) {
      return;
    }

    if (args.value && args.value.length > 256) {
      setError('Достигнуто максимальное количество символов');
      dispatch(setNewGroupParams({ isDynamic, name: args.value.trim().substring(0, 256) }));
      return;
    }

    dispatch(setNewGroupParams({ isDynamic, name: args.value ? args.value.trim() : '' }));
  };

  const handleToggleDynamicGroup = ({ checked }: { checked: boolean }): void => {
    dispatch(setNewGroupParams({ isDynamic: checked, name }));
  };

  const handleCloseDialog = (): void => {
    dispatch(toggleDialog(false));
    dispatch(setNewGroupParams({ isDynamic: false, name: '' }));
  };

  const setValidationError = (message: string) => {
    setError(message);
    textFieldRef.current?.focus();
  };

  const validate = (value: string): boolean => {
    if (value.length === 0 || !value) {
      setValidationError('Название группы объектов не может быть пустым');
      return false;
    }

    if (value.length === 1) {
      setValidationError('Название группы объектов должно содержать более одного символа');
      return false;
    }

    if (existingGroupObjects?.find((groupObject) => groupObject.name === value)) {
      setValidationError(`Группа объектов с именем "${value}" уже существует`);
      return false;
    }

    return true;
  };

  const handleCreateObjectGroup = (): void => {
    if (validate(name)) {
      dispatch(createNewGroup(name));
      handleCloseDialog();
    }
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
          inputRef={textFieldRef}
          state={error ? 'alert' : undefined}
          value={name}
          className={cnObjectGroup('DialogInput').toString()}
          width="full"
        />
        <Text view="alert" size="xs" className={cnObjectGroup('DialogError').toString()}>
          {error}
        </Text>
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
