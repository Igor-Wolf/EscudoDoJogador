import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  ${({ $isopen }) => `
    display: ${$isopen ? 'flex' : 'none'};
  `}
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const PopupContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

export const Input = styled.input`
  padding: 8px;
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
`;

export const Button = styled.button`
  margin: 10px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;
