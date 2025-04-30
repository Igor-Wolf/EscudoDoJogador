import React, { useEffect, useState, useRef } from "react";
import { Container } from "./styles";

function PlayAudio({ audio }) {
  const [currentAudio, setCurrentAudio] = useState("");
  const [volume, setVolume] = useState(0.5); // volume padrão
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audio || audio === currentAudio) return;

    function tocarAudio(path) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const newAudio = new Audio(path);
      newAudio.loop = true;
      newAudio.volume = volume;
      newAudio.play();
      audioRef.current = newAudio;
    }

    switch (audio) {
      case "normal":
        tocarAudio("/Assets/normal.mp3");
        break;
      case "ação":
        tocarAudio("/Assets/acao.mp3");
        break;
      case "misterio":
        tocarAudio("/Assets/misterio.mp3");
        break;
      case "terror":
        tocarAudio("/Assets/terror.mp3");
        break;
      case "drama":
        tocarAudio("/Assets/drama.mp3");
        break;
      case "aventura":
        tocarAudio("/Assets/aventura.mp3");
        break;
      default:
        tocarAudio("/Assets/normal.mp3");
        break;
    }

    setCurrentAudio(audio);
  }, [audio, currentAudio, volume]);

  // Atualiza o volume em tempo real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <Container>
      <strong>Gênero atual:</strong> {currentAudio}
      <br />
      <label>
        Volume:{"    "}  
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </label>
    </Container>
  );
}

export default PlayAudio;
