import React from 'react';
import styled from 'styled-components';

const CanvasWarapper = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CanvasTitle = styled.div`

`;

interface CanvasProps {
  width: number;
  height: number;
  title: string;
  refer: any;
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  title,
  refer,
}) => {
  return (
    <CanvasWarapper>
      <canvas 
        ref={refer} 
        width={width} 
        height={height} 
        style={{background:'white', border: '1px solid black'}}
      />
      <CanvasTitle>
        {title}
      </CanvasTitle>
    </CanvasWarapper>
  )
}

export default Canvas;