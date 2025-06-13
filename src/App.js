import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import naveImage from './assets/nave.png';
import RankingChart from './RankingChart';
import PlayerSelection from './PlayerSelection'; // Importa o novo componente

function App() {
  const [valor, setValor] = useState(0);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false); // NOVO ESTADO
  const [selectedAvatar, setSelectedAvatar] = useState(null); // NOVO ESTADO para guardar o avatar selecionado

  const naveRef = useRef(null);
  const overlayRef = useRef(null);

  const handleClick = (novoValor) => {
    if (novoValor === 3) { // Se o valor for 3 (botão Player)
      setShowPlayerSelection(true); // Mostra a janela de seleção
    } else {
      setValor(novoValor); // Define o valor normal para outros botões
    }
    console.log(`Valor atualizado para: ${novoValor}`);
  };

  const handleCloseRanking = () => {
    setValor(0);
    console.log('Ranking fechado. Valor resetado para: 0');
  };

  const handleClosePlayerSelection = () => { // NOVA FUNÇÃO para fechar a seleção do player
    setShowPlayerSelection(false);
  };

  const handleSelectAvatar = (avatarSrc) => { // NOVA FUNÇÃO para lidar com a seleção do avatar
    setSelectedAvatar(avatarSrc);
    console.log('Avatar selecionado:', avatarSrc);
    // Aqui você pode fazer algo com o avatar selecionado, como armazenar no localStorage
  };

  useEffect(() => {
    const adjustOverlay = () => {
      if (naveRef.current && overlayRef.current) {
        const naveRect = naveRef.current.getBoundingClientRect();

        overlayRef.current.style.setProperty('--overlay-width', `${naveRect.width}px`);
        overlayRef.current.style.setProperty('--overlay-height', `${naveRect.height}px`);
        overlayRef.current.style.setProperty('--overlay-top', `${naveRect.top}px`);
        overlayRef.current.style.setProperty('--overlay-left', `${naveRect.left}px`);
      }
    };

    const currentNaveRef = naveRef.current;

    adjustOverlay();

    window.addEventListener('resize', adjustOverlay);

    if (currentNaveRef) {
        currentNaveRef.addEventListener('load', adjustOverlay);
    }

    return () => {
      window.removeEventListener('resize', adjustOverlay);
      if (currentNaveRef) {
          currentNaveRef.removeEventListener('load', adjustOverlay);
      }
    };
  }, []);

  return (
    <div className="app-container">
      <img
        src={naveImage}
        alt="Nave Espacial"
        className="background-nave"
        ref={naveRef}
      />

      <div className="overlay-content" ref={overlayRef}>
        <button
          className="transparent-button missao-especial-button"
          onClick={() => handleClick(1)}
          aria-label="Missão Especial"
        ></button>

        <button
          className="transparent-button metas-button"
          onClick={() => handleClick(2)}
          aria-label="Metas"
        ></button>

        <button
          className="transparent-button player-button"
          onClick={() => handleClick(3)} // Agora handleClick(3) vai abrir a seleção de avatar
          aria-label="Player"
        ></button>

        <button
          className="transparent-button dados-button"
          onClick={() => handleClick(4)}
          aria-label="Dados"
        ></button>

        <button
          className="transparent-button ranking-button"
          onClick={() => handleClick(5)}
          aria-label="Ranking"
        ></button>

        <div className="display-valor">
          Valor: {valor}
          {selectedAvatar && ( // Mostra o avatar selecionado (opcional)
            <img src={selectedAvatar} alt="Avatar do Jogador" className="current-player-avatar" />
          )}
        </div>
      </div>

      {valor === 5 && <RankingChart onClose={handleCloseRanking} />}
      {showPlayerSelection && ( // Renderiza o PlayerSelection se showPlayerSelection for true
        <PlayerSelection 
          onClose={handleClosePlayerSelection} 
          onSelectAvatar={handleSelectAvatar} 
        />
      )}
    </div>
  );
}

export default App;