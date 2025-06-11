import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Importa o arquivo CSS principal
import naveImage from './assets/nave.png'; // Importa a imagem da nave
import RankingChart from './RankingChart'; // Importa o componente de ranking

function App() {
  const [valor, setValor] = useState(0); // Estado que controla o valor atual
  const naveRef = useRef(null); // Ref para a imagem da nave
  const overlayRef = useRef(null); // Ref para o container dos botões

  // Função para lidar com o clique nos botões da nave
  const handleClick = (novoValor) => {
    setValor(novoValor);
    console.log(`Valor atualizado para: ${novoValor}`); // Para depuração no console
  };

  // Função para fechar o ranking (seta valor de volta para 0)
  const handleCloseRanking = () => {
    setValor(0);
    console.log('Ranking fechado. Valor resetado para: 0'); // Para depuração
  };

  // Efeito para ajustar o overlay dos botões para que ele corresponda à imagem da nave
  useEffect(() => {
    const adjustOverlay = () => {
      if (naveRef.current && overlayRef.current) {
        // Obtém as dimensões e a posição real da imagem da nave na tela
        const naveRect = naveRef.current.getBoundingClientRect();

        // Aplica essas dimensões e posição como variáveis CSS no overlay-content
        overlayRef.current.style.setProperty('--overlay-width', `${naveRect.width}px`);
        overlayRef.current.style.setProperty('--overlay-height', `${naveRect.height}px`);
        overlayRef.current.style.setProperty('--overlay-top', `${naveRect.top}px`);
        overlayRef.current.style.setProperty('--overlay-left', `${naveRect.left}px`);
      }
    };

    // Ajusta o overlay inicialmente
    adjustOverlay();

    // Adiciona event listeners para reajustar o overlay em redimensionamento de janela
    window.addEventListener('resize', adjustOverlay);

    // Adiciona event listener para reajustar quando a imagem for completamente carregada
    // Isso é crucial para garantir que getBoundingClientRect retorne valores corretos
    if (naveRef.current) {
        naveRef.current.addEventListener('load', adjustOverlay);
    }

    // Função de limpeza: remove os event listeners quando o componente é desmontado
    return () => {
      window.removeEventListener('resize', adjustOverlay);
      if (naveRef.current) {
          naveRef.current.removeEventListener('load', adjustOverlay);
      }
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez na montagem do componente

  return (
    <div className="app-container">
      {/* Imagem da nave, que servirá de fundo e referência para o posicionamento dos botões */}
      <img
        src={naveImage}
        alt="Nave Espacial"
        className="background-nave"
        ref={naveRef} // Conecta a ref ao elemento img
      />

      {/* Container que irá sobrepor a imagem da nave e conter os botões */}
      <div className="overlay-content" ref={overlayRef}> {/* Conecta a ref ao elemento div */}
        {/* Botões transparentes posicionados sobre a imagem */}
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
          onClick={() => handleClick(5)} // Ao clicar, define valor = 5
          aria-label="Ranking"
        ></button>

        {/* Display para mostrar o valor atual, posicionado na imagem */}
        <div className="display-valor">
          Valor: {valor}
        </div>
      </div>

      {/* Renderização condicional do componente RankingChart */}
      {/* Ele só será renderizado se a variável 'valor' for igual a 5 */}
      {/* Passamos a função handleCloseRanking como prop para que o RankingChart possa se fechar */}
      {valor === 5 && <RankingChart onClose={handleCloseRanking} />}
    </div>
  );
}

export default App;