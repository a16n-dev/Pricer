import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

// HOC to allow a component to render a confirmation dialog by calling the confirm function

export interface confirmationProps {
    confirm: (message: string, action: () => void) => void;
}

interface modalState {
    message: string;
    action: () => void;
}

const withConfirmation = <ComponentProps, >(
  Component: React.ComponentType<confirmationProps & ComponentProps>,
) => (props: ComponentProps) => {
    const [ modal, setModal ] = useState<boolean>(false);
    const [ modalState, setModalState ] = useState<modalState>({
      message: '',
      action: () => {},
    });
    
    const renderModal = (message: string, action: () => void) => {
      setModalState({
        message,
        action,
      });
      setModal(true);
    };

    return(
      <>
        <ConfirmationModal
          modal={modal}
          closeModal={setModal}
          message={modalState.message}
          action={modalState.action}></ConfirmationModal>
        <Component {...props} confirm={renderModal}/>
      </>
    );
  };

export default withConfirmation;