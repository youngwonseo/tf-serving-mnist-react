import React from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  margin : 0.8rem;
  padding: 0.5rem;
`;


interface ButtonProps {
  onClick: any;
  text: string;
}


const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
}) => {
  return (
    <ButtonWrapper onClick={onClick}>
      {text}
    </ButtonWrapper>
  );
}

export default Button;