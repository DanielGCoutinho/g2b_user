import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import naveImage from './assets/nave.png';
import RankingChart from './RankingChart';

function App() {
  const [valor, setValor] = useState(0);
  const naveRef = useRef(null);
  const overlayRef = useRef(null);

  const handleClick = (novoValor) => {
    setValor(novoValor);
    console.log(`Valor atualizado para: ${novoValor}`);
  };

  const handleCloseRanking = () => {
    setValor(0);
    console.log('Ranking fechado. Valor resetado para: 0');
  };

  // Linha 54: Início do useEffect que precisa de refatoração
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

    // Armazena a referência atual do elemento em uma variável local
    const currentNaveRef = naveRef.current; 

    // Ajusta o overlay inicialmente
    adjustOverlay();

    // Adiciona event listeners para reajustar o overlay em redimensionamento de janela
    window.addEventListener('resize', adjustOverlay);

    // Adiciona event listener para reajustar quando a imagem for completamente carregada
    // Usamos 'currentNaveRef' aqui
    if (currentNaveRef) {
        currentNaveRef.addEventListener('load', adjustOverlay);
    }

    // Função de limpeza: remove os event listeners quando o componente é desmontado
    // Usamos 'currentNaveRef' aqui também
    return () => {
      window.removeEventListener('resize', adjustOverlay);
      if (currentNaveRef) { // Verifica se a referência ainda existe antes de remover o listener
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
          onClick={() => handleClick(3)}
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
        </div>
      </div>

      {valor === 5 && <RankingChart onClose={handleCloseRanking} />}
    </div>
  );
}

export default App;