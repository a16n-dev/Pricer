import { ComponentType, createContext, useState } from 'react';

export interface ModalObject<req = any, res = any> {
    resolve: (value: res) => void;
    reject: (reason?: any) => void;
    data?: req;
    component: ComponentType<ModalProps<req, res>>;
}

export interface ModalProps<req, res> {
    data?: req;
    onSubmit: (res: res) => unknown;
    onCancel: () => unknown;
}

interface contextState {
    modalStack: Array<ModalObject>;
    addModal: (obj: ModalObject) => void;
}

export const ModalContext = createContext<contextState>({
  modalStack: [],
  addModal: () => {},
});

export const ModalProvider: React.FC = ({children}) => {

  const [ modals, setModals ] = useState<Array<ModalObject>>([]);

  console.log(modals);

  const ctx: contextState = {
    modalStack: modals,
    addModal: obj => {
      setModals([ ...modals, obj ]);
    },
  };

  return (
    <ModalContext.Provider value={ctx}>
      {children}
      {modals.map((m, i) => {
        console.log('mappin');
        const onSubmit = (data?: unknown) => {
          m.resolve(data);
          setModals(modals.filter(v => v !== m));
        };

        const onCancel = () => {
          m.resolve(undefined);
          setModals(modals.filter(v => v !== m));
        };
        return (<m.component data={m.data} onSubmit={onSubmit} onCancel={onCancel} key={i}/>);
      })}
    </ModalContext.Provider>
  );
};