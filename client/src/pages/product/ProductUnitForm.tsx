import { nanoid } from 'nanoid';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Modal,
  ModalBody,

  ModalHeader,
} from 'reactstrap';
import { ModalProps } from '../../components/functionalModal/ModalProvider';
import { Unit, UnitData } from '../../models/Unit';
import { RootState } from '../../redux/store';
import UnitForm from '../unit/UnitForm';

const ProductUnitForm: React.FC<ModalProps<Unit, Unit | null>> = ({
  data,
  onSubmit,
  onCancel,
}) => {
  const selectorFunction = (state: RootState) => state.units.units;
  const units = useSelector(selectorFunction);

  const submit = (unitData: UnitData) => {
    const unit: Unit = {
      dateCreated: Date.now(),
      userId: '0',
      id: nanoid(),
      ...data,
      ...unitData,
      dateUpdated: Date.now(),
    };
    onSubmit(unit);
  };

  const onDelete = () => {
    onSubmit(null);
  };

  return (
    <Modal isOpen={true} toggle={onCancel} centered size="lg">
      <ModalHeader toggle={onCancel}>
        Unit
      </ModalHeader>
      <ModalBody>
        <UnitForm
          units={Object.values(units)}
          disableForm={false}
          onDelete={onDelete}
          existingUnit={data}
          onSubmit={submit}
        />
      </ModalBody>
    </Modal>
  );
};

export default ProductUnitForm;
