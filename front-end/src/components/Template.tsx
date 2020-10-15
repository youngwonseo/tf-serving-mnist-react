import React from 'react';
import styled from 'styled-components';

const TemplateWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface TemplateProps {

}

export const Title = styled.h1`

`;

export const Contents = styled.div`
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