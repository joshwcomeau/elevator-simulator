import React from 'react';
import styled from 'styled-components';

import { FLOOR_HEIGHT } from '../../constants';

const Floor = ({ innerRef, children }) => {
  return <FloorElem innerRef={innerRef}>{children}</FloorElem>;
};

const FloorElem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  height: ${FLOOR_HEIGHT}px;
  border-bottom: 1px solid #333;
`;

export default Floor;
