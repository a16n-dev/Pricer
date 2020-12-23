import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface confirmationModalProps {
    modal: boolean;
    closeModal: React.Dispatch<React.SetStateAction<boolean>>
    message: string;
    action: () => void;
}

const ConfirmationModal: React.FC<confirmationModalProps> = ({
  modal,
  closeModal,
  message,
  action,
}) => {

  const execAction = () => {
    action();
    closeModal(false);
  };

  const toggle = () => closeModal(false);

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirm Action</ModalHeader>
      <ModalBody>
        {message}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={execAction}>Confirm</Button>{' '}
        <Button color="primary" outline onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;