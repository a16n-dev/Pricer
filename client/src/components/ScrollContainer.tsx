const ScrollContainer: React.FC = ({children}) => (
  <div className={'position-relative h-100'}>
    <div className={'position-absolute overflow-auto'} style={{inset: 0}}>
      {children}
    </div>
  </div>
);

export default ScrollContainer;