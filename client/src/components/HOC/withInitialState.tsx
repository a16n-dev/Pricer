// HOC to inject passed component with initial state.

export interface initialStateProps<T, > {
    initialState: T
}

const withInitialState = <ComponentProps, StateType>(
  Component: React.ComponentType<ComponentProps & {initialState: StateType}>,
  state: () => StateType,
) => ((props: ComponentProps) => (
    <>
      <Component {...props} initialState={state()}/>
    </>
  ));

export default withInitialState;