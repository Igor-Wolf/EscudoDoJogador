import React, { useEffect, useState, useRef } from "react";
import { Container } from "./styles";

function PlayAudioVoice({ audio }) {
  const [volume, setVolume] = useState(0.5); // volume padrão
  const audioRef = useRef(null); // Usado para referenciar o elemento de áudio

  useEffect(() => {
    // Verifique se o 'audio' é válido
    if (!audio || !(audio instanceof Blob)) {
      return;
    }

    // Crie a URL do Blob de áudio
    const audioURL = URL.createObjectURL(audio);
    
    // Atualize a referência do áudio e configure o volume
    if (audioRef.current) {
      audioRef.current.src = audioURL; // Atribua a URL ao elemento de áudio
      audioRef.current.loop = false;
      audioRef.current.volume = volume;
      audioRef.current.play(); // Inicie a reprodução
    }



    

    // Libere o URL do Blob após a utilização
    return () => {
      URL.revokeObjectURL(audioURL);
    };
  }, [audio]); // Reproduza o áudio sempre que o 'audio' ou o volume mudar

  // Atualiza o volume em tempo real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <Container>
      <strong>Narração</strong>
      <br />
      {/* Adicionando controles para ajustar o volume */}
      <label>
        Volume:{" "}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </label>

      {/* O elemento de áudio é usado para controlar a reprodução */}
      <audio ref={audioRef} />
    </Container>
  );
}

export default PlayAudioVoice;
