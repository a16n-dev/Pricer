import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { ModalProps } from '../../components/functionalModal/ModalProvider';

const SimpleModal: React.FC<ModalProps<string, string>> = ({onSubmit, onCancel, data}) => (
  <Modal isOpen={true} centered toggle={onCancel}>
    <ModalHeader toggle={onCancel}>he</ModalHeader>
    <ModalBody>
      hi!
      {data}
    </ModalBody>
  </Modal>
);

export default SimpleModal;
