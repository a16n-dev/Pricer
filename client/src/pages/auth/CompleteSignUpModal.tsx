import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface CompleteSignUpModalProps {
    hide: () => void;
}

const CompleteSignUpModal: React.FC<CompleteSignUpModalProps> = ({hide}) => {
  const { register, handleSubmit, errors } = useForm();

    
  const onSubmit = () => {

  };

  return (
    <Modal>
      <ModalHeader toggle={hide}>Create new password</ModalHeader>
      <ModalBody>
        <p>You must replace your temporary password before continuing</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Username</Label>
            <input
              name="password"
              className={'form-control'}
              placeholder="Enter a new password"
              ref={register}
            />
          </FormGroup>
          <FormGroup>
            <Button type="submit" color={'primary'} block>Login</Button>
          </FormGroup>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default CompleteSignUpModal;