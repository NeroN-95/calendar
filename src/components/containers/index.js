import styled from "styled-components";


export const CellWrapper = styled.div`
      min-width: 140px;
      min-height: ${props => props.isHeader ? 18 : 80}px;
      background-color: ${props => props.isWeekend ? '#D3D3D3FF' : 'white'};
      color: ${props => props.isSelectedMon ? '#0C0C0CFF' : '#5D5D5DFF'};
    `;
export const RowCell = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
      ${props => props.pr && `padding-right : ${props.pr + 8}px`}
    `;