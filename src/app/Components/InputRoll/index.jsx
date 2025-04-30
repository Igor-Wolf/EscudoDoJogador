import React, { useState } from "react";
import { Button } from "../Button";
import {
  BtnContainer,
  ImputSearch,
  LabelButton,
  LabelResult,
  WrapperButtons,
} from "./styles";
import { rollf } from "@/app/utils/rollDice";

const InputRoll = () => {
  const [labelName, setLabelName] = useState("");

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Atualiza o valor do input conforme o usuário digita
  };

  const handleClickButton = (name) => {

    const result = rollf(name)

    setLabelName(result);
  };

  return (
    <WrapperButtons>
      <BtnContainer>
        <ImputSearch
          value={inputValue}
          onChange={handleInputChange} // Atualiza o estado ao digitar
          placeholder="2d20 + 5"
        />
        <LabelResult>{ labelName }</LabelResult>
        <Button
          title="Rolar "
          variant="primary"
          onClick={() => handleClickButton(inputValue)}
        ></Button>
      </BtnContainer>
    </WrapperButtons>
  );
};

export { InputRoll };
