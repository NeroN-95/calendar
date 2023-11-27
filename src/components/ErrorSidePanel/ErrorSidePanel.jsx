import styled from "styled-components";

const ErrorPanel = styled('div')`
  position: fixed;
  top: 75%;
  left: 0;
  width: 150px;
  height: 90px;
  border-radius: 0 15px 15px 0;
  background-color: red;
  color: white;
  padding: 5px 0 10px 10px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  z-index: 999;
`;
const ButtonError = styled('button')`
  padding: 5px;
  background-color: white;
  border-radius: 5px;
  color: red;
  border: 1px solid red;
  cursor: pointer;
  margin-left: 60px;
`;
const ErrorSidePanel = ({ message, onClose }) => {
    return (
        <ErrorPanel >
            <p>{message}</p>
            <ButtonError onClick={onClose}>Close</ButtonError>
        </ErrorPanel>
    );
};

export default ErrorSidePanel;