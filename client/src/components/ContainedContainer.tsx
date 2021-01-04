import { useEffect, useRef } from 'react';
import { Container } from 'reactstrap';

const ContainedContainer: React.FC = ({children}) => {
    
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = containerRef.current;
    if(div){
      div.style.marginTop = `max(calc(3rem - ${div.getBoundingClientRect().top}px), 0px)`;

      div.style.height = `calc(100vh - ${div.offsetTop}px - 3rem)`;

    }
  });
  return (
    <div
      ref={containerRef}
      className={'d-flex flex-column mb-5'}
    >
      {children}
    </div>
  )
  ;
};

export default ContainedContainer;