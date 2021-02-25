import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Form as VegaForm,
  IconClose,
  Modal,
  Switch,
  usePortal,
} from '@gpn-prototypes/vega-ui';
import { FormApi } from 'final-form';
import createDecorator from 'final-form-focus';

import { TextField as FormTextField } from '../form';

import { cnObjectGroup } from './cn-objects-group';

import { createNewGroup, toggleDialog } from '@/redux-store/group-objects/actions';
import { getGroupObjectsNodeList, getIsDialogOpened } from '@/redux-store/group-objects/selectors';
import { NewGroupParams } from '@/types/redux-store';
import { createValidate, validators } from '@/utils/validation';

const focusOnErrors = createDecorator<NewGroupParams>();

export const ObjectsGroupDialog: React.FC = () => {
  const dispatch = useDispatch();

  const { portal } = usePortal({ name: 'modalRoot' });

  const isDialogOpen = useSelector(getIsDialogOpened);
  const existingGroupObjects = useSelector(getGroupObjectsNodeList);

  const validator = createValidate<Partial<NewGroupParams>>({
    name: [
      validators.required(undefined, () => 'Заполните обязательное поле'),
      validators.minLength(
        2,
        () => 'Название проекта не может быть менее 2 символов и более 256 символов',
      ),
      validators.maxLength(
        256,
        () => 'Название проекта не может быть менее 2 символов и более 256 символов',
      ),
      validators.isGroupObjectAlreadyExist(existingGroupObjects),
    ],
  });

  const handleCloseDialog = (form: FormApi<NewGroupParams, Partial<NewGroupParams>>): void => {
    setTimeout(form.reset);
    dispatch(toggleDialog(false));
  };

  const handleCreateObjectGroup = (
    values: NewGroupParams,
    form: FormApi<NewGroupParams, Partial<NewGroupParams>>,
  ): void => {
    dispatch(createNewGroup(values.name.trim()));
    handleCloseDialog(form);
  };

  const decorators = useMemo(() => [focusOnErrors], []);

  return (
    <Form
      initialValues={{ name: '', isDynamic: false }}
      validate={validator}
      onSubmit={handleCreateObjectGroup}
      decorators={decorators}
      render={({ form, handleSubmit }): React.ReactNode => (
        <VegaForm onSubmit={handleSubmit} className={cnObjectGroup('DialogForm')}>
          <Modal
            className={cnObjectGroup('Dialog')}
            portal={portal}
            isOpen={isDialogOpen}
            onClose={() => {
              handleCloseDialog(form);
            }}
            hasOverlay
          >
            <div className={cnObjectGroup('DialogContent')}>
              <h4 className={cnObjectGroup('DialogTitle')}>Название группы</h4>
              <p className={cnObjectGroup('DialogInputLabel').toString()}>Название</p>
              <Field
                name="name"
                render={({ input, meta }): React.ReactNode => {
                  return (
                    <FormTextField
                      input={input}
                      meta={meta}
                      trimOnBlur
                      className={cnObjectGroup('DialogInput').toString()}
                      placeholder="Введите название группы объектов"
                      width="full"
                      name="name"
                    />
                  );
                }}
              />
              <div className={cnObjectGroup('DialogControllers')}>
                <div className={cnObjectGroup('DialogDynamicGroupSwitcher')}>
                  <Field
                    name="isDynamic"
                    type="checkbox"
                    render={({ input }): React.ReactNode => {
                      return (
                        <Switch
                          size="m"
                          checked={input.checked}
                          onChange={({ e }): void => input.onChange(e)}
                          label="Динамическая"
                        />
                      );
                    }}
                  />
                </div>

                <div className={cnObjectGroup('DialogButtons')}>
                  <Button type="submit" onClick={handleSubmit} size="s" label="Создать группу" />
                  <Button
                    onClick={() => {
                      handleCloseDialog(form);
                    }}
                    size="s"
                    view="ghost"
                    label="Отмена"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  handleCloseDialog(form);
                }}
                className={cnObjectGroup('DialogCloser')}
                type="button"
              >
                <IconClose size="s" />
              </button>
            </div>
          </Modal>
        </VegaForm>
      )}
    />
  );
};
