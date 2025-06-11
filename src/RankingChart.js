import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './RankingChart.css';
import spaceBg from './assets/space_background.png'; // NOVA IMAGEM DE FUNDO
import spaceshipIcon from './assets/spaceship_icon.png'; // NOVO ÍCONE DE NAVE

function RankingChart({ onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbS_7qFSgGIvpJg1Yck5Ozqm2uI7unUlxxjzCjKf1vwVgKZUdrfPCodWhukn2Lf9opNiu9PNniSY0f/pub?gid=148660743&single=true&output=csv";

  useEffect(() => {
    const fetchRankingData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status} - Verifique a URL ou permissões da planilha.`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map(item => {
              if (item && item.Pontos !== undefined && item.Pontos !== null) {
                const pontosNumerico = parseFloat(String(item.Pontos).replace(',', '.'));
                if (!isNaN(pontosNumerico)) {
                  return { ...item, Pontos: pontosNumerico };
                }
              }
              return null;
            }).filter(item => item !== null && item.Vendedor && typeof item.Pontos === 'number' && !isNaN(item.Pontos));

            const sortedData = processedData.sort((a, b) => b.Pontos - a.Pontos);
            
            const maxPoints = sortedData.length > 0 ? sortedData[0].Pontos : 1;
            
            const dataWithProgress = sortedData.map(item => ({
              ...item,
              // O progresso será a largura percentual. Podemos ajustar o máximo para ser um pouco menor
              // para não 'bater' na borda da tela.
              progressPercentage: (item.Pontos / maxPoints) * 90 // 90% para deixar uma margem
            }));

            setData(dataWithProgress);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          }
        });

      } catch (e) {
        console.error("Erro ao buscar dados do ranking:", e);
        setError(e);
        setLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  if (loading) {
    return (
      <div className="ranking-chart-container space-ranking-layout">
        <button className="close-button" onClick={onClose} aria-label="Fechar Ranking">X</button>
        Carregando dados do ranking...
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-chart-container error space-ranking-layout">
        <button className="close-button" onClick={onClose} aria-label="Fechar Ranking">X</button>
        Erro ao carregar o ranking: {error.message}
      </div>
    );
  }

  return (
    <div className="ranking-chart-container space-ranking-layout" 
         style={{ backgroundImage: `url(${spaceBg})` }}> {/* Fundo espacial aqui */}
      <button className="close-button" onClick={onClose} aria-label="Fechar Ranking">X</button>

      <h2>Ranking de Exploradores Espaciais</h2> {/* Novo título */}
      
      <div className="space-ranking-elements"> {/* Contêiner para os elementos do ranking */}
        {data.map((item, index) => (
          <div key={index} className="space-explorer-row">
            <span className="explorer-rank">{index + 1}.</span> {/* Posição do ranking */}
            <span className="explorer-name">{item.Vendedor}</span>
            <div className="progress-track"> {/* O "caminho" no espaço */}
              <div 
                className="progress-fill" 
                style={{ width: `${item.progressPercentage}%` }}> {/* A barra de progresso / rastro */}
                <img src={spaceshipIcon} alt="Nave Espacial" className="spaceship-icon" /> {/* Ícone da nave */}
                <span className="explorer-points">{item.Pontos}</span> {/* Pontos da nave */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RankingChart;