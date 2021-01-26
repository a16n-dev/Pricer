import { ComponentType, useContext } from 'react';
import { ModalContext, ModalObject, ModalProps } from './ModalProvider';

export const useModal = () => {

  const {addModal} = useContext(ModalContext);

  return {
    show: async <req, res>(
      modal: ComponentType<ModalProps<req, res>>,
      data?: req,
    ): Promise<res | undefined> => new Promise((resolve, reject) => {
      const obj: ModalObject<req, res> = {
        resolve,
        reject,
        data,
        component: modal,
      };
      addModal(obj);
    }),
  };
};