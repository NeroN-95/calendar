import styled from "styled-components";

const DivWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;
const TextWrapper = styled('span')`
font-size: 33px;
`;
const TitleWrapper = styled(TextWrapper)`
  font-weight: bold;
  margin-right: 8px;
`;
const ButtonWrapper = styled('button')`
  border: unset;
  height: 22px;
  margin-right: 2px;
  border-radius: 4px;
  cursor : pointer;

`;

const ButtonsWrapper = styled( 'div')`
  display: flex;
  align-items: center;
`;
const Control = ({today,prevHendler,todayHendler,nextHendler}) => {
    return (
        <DivWrapper>
            <div>
                <TitleWrapper> {today.format('MMMM')} </TitleWrapper>
                <TextWrapper>{today.format("YYYY")}</TextWrapper>
            </div>
            <ButtonsWrapper>
                <ButtonWrapper onClick={prevHendler}> &lt; </ButtonWrapper>
                <ButtonWrapper onClick={todayHendler}>Today</ButtonWrapper>
                <ButtonWrapper onClick={nextHendler}> &gt; </ButtonWrapper>
            </ButtonsWrapper>
        </DivWrapper>
    );
};

export default Control;