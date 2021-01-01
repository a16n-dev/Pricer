// HOC to inject passed component with initial state.
// The component gives a selector prop that indicates what data should be selected from the state.

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export interface reduxStateProps<T, > {
  state: T
}

const withReduxState = <ComponentProps, StateType>(
  Component: React.ComponentType<ComponentProps & {state: StateType}>,
  selectorFunction: (store: RootState) => StateType,
) => ((props: ComponentProps) => {
  
    const state = useSelector(selectorFunction);

    return (
      <>
        <Component {...props} state={state}/>
      </>
    )
    ;
  });

export default withReduxState;