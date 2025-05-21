"use client";

import React, { useState } from "react";
import {
  ButtonsContainer,
  Container,
  Container1,
  ContainerFicha,
  ExternalContainer,
  ImputContainer,
  InternalContainerLeft,
  LeftContainer,
  RightContainer,
  TabsContainer,
  TitleText,
  WrapperAudio,
} from "./styles";
import { Card } from "./Components/Card";
import { InputUser } from "./Components/InputUser";
import { Button } from "./Components/Button";
import { InputFicha } from "./Components/InputFicha";
import PdfViwer from "./Components/PdfViwer";
import Popup from "./Components/Popup";
import { Chat } from "./Components/Chat";
import { InputRoll } from "./Components/InputRoll";
import { audioTheme } from "./utils/chatReqAudioTheme";
import PlayAudio from "./Components/PlayAudio";
import { api } from "./Services/api";
import PlayAudioVoice from "./Components/PlayAudioVoice";

import dynamic from "next/dynamic";

const Recorder = dynamic(() => import("./Components/Recorder"), {
  ssr: false, // impede que o pacote seja carregado no lado do servidor
});


export default function Home() {
  const [dataChat, setDataChat] = useState([]);
  const [tabs, setTabs] = useState("Chat");

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [typeTabInit, setTypeTabInit] = useState();

  const [containerIds, setContainerIds] = useState([]);

  const [currentAudioTheme, setCurrentAudioTheme] = useState("");

  const [voiceAudio, setVoiceAudio] = useState("");

  const [checkedAudio, setCheckedAudio] = useState(true);
  const [checkedVoice, setCheckedVoice] = useState(true);

  // Função chamada sempre que o valor da checkbox muda
  const handleCheckboxChange = (key, event) => {
    if (key === 1) {
      setCheckedAudio(event.target.checked);
    } else if (key === 2) {
      setCheckedVoice(event.target.checked);
    }
  };

  const adicionarContainer = (value) => {
    const novoId = value;
    //Date.now() + Math.random();
    setContainerIds((prev) => [...prev, novoId]);
  };

  // Função para manipular o clique no botão
  const handleClickButton = async (btnName) => {
    // Criação do objeto da requisição do usuário
    let lista = [...dataChat];
    lista.push({
      role: "user",
      content: btnName,
    });

    // Adicionando um espaço reservado para a resposta do assistente
    lista.push({
      role: "assistant",
      content: "...",
    });

    // Atualizando o estado com a nova lista de mensagens
    setDataChat(lista);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // ou 'auto' se não quiser animação
    });

    const bodyValue = {
      //gemma3:12b
      //deepseek-r1:14b
      model: "gemma3:12b",
      messages: lista, // Enviando as mensagens atualizadas
      system: `Responda sempre na linguagem Português do Brasil. Nunca utilize " nos diálogos sempre ' `,
      format: {
        type: "object",
        properties: {
          content: {
            type: "string",
          },
        },
        required: ["content"],
      },
    };

    try {
      // Usando fetch para streaming de dados
      const response = await fetch("http://localhost:3333/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyValue),
      });

      // Verificando se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro na requisição. Status: ${response.status}`);
      }

      // Variável para acumular a resposta do assistente
      let accumulatedResponse = "";

      // Usando o Reader do Response para trabalhar com o fluxo de dados (streaming)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let converter;
      let auxi2;

      while (!done) {
        // Lê o próximo "chunk" de dados
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        // Decodificando o "chunk" de bytes para texto
        const chunk = decoder.decode(value, { stream: true });

        converter = JSON.parse("[" + chunk + "]");
        // Acumula a resposta recebida até o momento
        accumulatedResponse += converter[0].message.content;

        const match = accumulatedResponse.match(/"content"\s*:\s*"([^}]*)/);
        //const match = accumulatedResponse.match(/"content"\s*:\s*"((?:[^"\\]|\\.)*)/);

        if (match && match[1]) {
          let partialContent = match[1]; // conteúdo até agora
          lista[lista.length - 1].content = partialContent.replace(/\\"/g, "");
        }

        // Atualizando o estado com a lista de mensagens (re-renderiza a UI)
        setDataChat([...lista]);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth", // ou 'auto' se não quiser animação
        });
      }
    } catch (error) {
      //console.error("Erro ao fazer a requisição:", error.message);
    }

    if (checkedAudio) {
      const audio = await audioTheme(dataChat, currentAudioTheme);
      setCurrentAudioTheme(audio);
    }

    //----------------------------------------------------------------------------------------------------- voice audio
    if (checkedVoice) {
      const formData = new FormData();
      await formData.append("text", lista[lista.length - 1].content);
      formData.append("language", "pt");
      try {
        const response = await api.post("/create-audio", formData, {
          responseType: "blob", // importante se a resposta for um áudio
        });
        setVoiceAudio(response.data);
      } catch (error) {
        console.error("Erro ao gerar áudio:", error);
      }
    }
  };

  const handleClickButtonErase = () => {
    let list = [...dataChat];
    list.pop();
    setDataChat([...list]);
  };
  const handleClickButtonDelete = () => {
    let list = [];
    setDataChat(list);
  };

  const handleClickButtonSave = () => {
    const list = [...dataChat];
    const json = JSON.stringify(list, null, 2);

    // Cria um blob com o JSON
    const blob = new Blob([json], { type: "application/json" });

    // Cria uma URL pro blob
    const url = URL.createObjectURL(blob);

    // Cria um link pra forçar o download
    const link = document.createElement("a");
    link.href = url;
    link.download = "lista.json";
    link.click();

    // Limpa a URL criada
    URL.revokeObjectURL(url);
  };

  const handleClickButtonImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setDataChat(json);
          console.log("JSON carregado:", json);
        } catch (err) {
          console.error("Erro ao ler JSON:", err);
        }
      };

      reader.readAsText(file);
    };

    input.click(); // Abre o seletor de arquivos
  };

  return (
    <ExternalContainer>
      <Popup
        isopen={isPopupOpen}
        tab={typeTabInit}
        onclose={() => setPopupOpen(false)}
        onconfirm={adicionarContainer}
      />
      <LeftContainer>
        <TabsContainer>
          <Button
            title="Chat "
            variant="primary"
            onClick={() => setTabs("Chat")}
          ></Button>

          <Button
            title="Ficha "
            variant="primary"
            onClick={() => setTabs("Ficha")}
          ></Button>

          {containerIds.map((item) => (
            <Button
              key={item.id}
              title={item.id} // <-- agora é string
              variant="primary"
              onClick={() => setTabs(item.id)}
            />
          ))}

          <Button
            title="Add PDF"
            typeTab="PDF"
            variant="Secondary"
            onClick={() => {
              setPopupOpen(true);
              setTypeTabInit("PDF");
            }}
          ></Button>
          <Button
            title="Add Chat"
            typeTab="Chat"
            variant="Secondary"
            onClick={() => {
              setPopupOpen(true);
              setTypeTabInit("Chat");
            }}
          ></Button>
        </TabsContainer>
        <ImputContainer>
          <InputFicha></InputFicha>
        </ImputContainer>
      </LeftContainer>
      <Container variant={tabs} name="Chat">
        <TitleText>Chat</TitleText>
        <Container1>
          {/* Renderizando os cards para cada item em dataChat */}
          {dataChat?.map((text, index) => (
            <Card key={index} objChat={text}></Card>
          ))}
        </Container1>

        <InputUser onButtonClick={handleClickButton}></InputUser>
          <Recorder onButtonClick={handleClickButton}></Recorder>
      </Container>

      <Container variant={tabs} name="Ficha">
        <TitleText>Ficha</TitleText>
        <PdfViwer></PdfViwer>
      </Container>

      {containerIds.map((item) =>
        item.tab === "PDF" ? (
          <Container key={item.id} variant={tabs} name={item.id}>
            <TitleText>{item.id}</TitleText>
            <PdfViwer></PdfViwer>
          </Container>
        ) : (
          <Container key={item.id} variant={tabs} name={item.id}>
            <TitleText>{item.id}</TitleText>
            <Chat></Chat>
          </Container>
        )
      )}

      <RightContainer>
        <ButtonsContainer>
          <Button
            title="Erase "
            variant="primary"
            onClick={() => handleClickButtonErase()}
          ></Button>
          <Button
            title="Delete "
            variant="primary"
            onClick={() => handleClickButtonDelete()}
          ></Button>
          <Button
            title="Save "
            variant="primary"
            onClick={() => handleClickButtonSave()}
          ></Button>
          <Button
            title="Import "
            variant="primary"
            onClick={() => handleClickButtonImport()}
          ></Button>
        </ButtonsContainer>
        <WrapperAudio>
          <PlayAudio audio={currentAudioTheme}></PlayAudio>

          <label>
            <input
              type="checkbox"
              checked={checkedAudio}
              onChange={(e) => handleCheckboxChange(1, e)}
            />{" "}
            Marcar
          </label>
        </WrapperAudio>
        <WrapperAudio>
          <PlayAudioVoice audio={voiceAudio}></PlayAudioVoice>
          <label>
            <input
              type="checkbox"
              checked={checkedVoice}
              onChange={(e) => handleCheckboxChange(2, e)}
            />{" "}
            Marcar
          </label>
        </WrapperAudio>

        <InputRoll></InputRoll>
      </RightContainer>
    </ExternalContainer>
  );
}
