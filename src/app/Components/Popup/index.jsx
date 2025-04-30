import React, { useState } from 'react';
import {
  Overlay,
  PopupContainer,
  Button,
  Input
} from './styles';

const Popup = ({ isopen, tab, onclose, onconfirm }) => {
  const [inputValue, setInputValue] = useState('');

    const handleConfirm = () => {
        const retorno = {
        
            id: inputValue,
            tab: tab

    }
    onconfirm(retorno);
    setInputValue('');
    onclose();
  };

  const handleCancel = () => {
    setInputValue('');
    onclose();
  };

  return (
      <Overlay $isopen={isopen}>
      <PopupContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite algo..."
        />
        <div>
          <Button onClick={handleConfirm}>Confirmar</Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </div>
      </PopupContainer>
    </Overlay>
  );
};

export default Popup;
