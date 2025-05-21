"use client";
import { useState } from "react";
import { api } from "@/app/Services/api";
import { ReactMediaRecorder } from "react-media-recorder";

function Recorder({ onButtonClick }) {
  const handleTextConvert = async (audioUrl) => {
    try {
      // Transformar mediaBlobUrl em Blob real
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const formData = new FormData();
      formData.append("audio_to_convert", audioBlob, "gravacao.wav"); // Nome opcional

      const res = await api.post("/create-text", formData, {
        responseType: "json", // ou 'json' dependendo da resposta da API
      });
      if (res.data) {

        onButtonClick(res.data.text)
        
      }
    } catch (error) {
      console.error("Erro ao gerar texto:", error);
    }
  };

  return (
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          <p>{status}</p>
          <button onClick={startRecording}>Iniciar</button>
          <button onClick={stopRecording}>Parar</button>
          <button
            onClick={() => {
              if (mediaBlobUrl) {
                handleTextConvert(mediaBlobUrl);
              } else {
                alert("Nenhuma gravação disponível.");
              }
            }}
          >
            Enviar
          </button>
          <audio src={mediaBlobUrl} controls />
        </div>
      )}
    />
  );
}

export default Recorder;
