import React from 'react';
import styled from 'styled-components';

const TemplateWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (min-width: 800px) {
    height: 100%;
  }
`;

interface TemplateProps {}

export const Title = styled.h1`
  text-align: center;
`;

export const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

export const ButtonGroup =  styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Template: React.FC<TemplateProps> = ({
  children
}) => {
  return (
    <TemplateWrapper>
      {children}
    </TemplateWrapper>
  );
}

export default Template;