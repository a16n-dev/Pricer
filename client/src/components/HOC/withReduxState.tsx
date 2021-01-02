import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';

// This is a HOC to wrap a page component.
// It gives that page access to a section of the state, as well as the url props.

export interface reduxStateProps<T, > {
  state: T
}

const withReduxState = <ComponentProps, StateType, URLParams = any>(
  Component: React.ComponentType<ComponentProps & {state: StateType}>,
  selectorFunction: (store: RootState, params: URLParams) => StateType,
) => ((props: ComponentProps) => {

    const params: URLParams = useParams<URLParams>();
    const state = useSelector<RootState>((store) => selectorFunction(store, params));
    console.log(params);
    return (
      <>
        <Component {...props} state={state as StateType}/>
      </>
    )
    ;
  });

export default withReduxState;