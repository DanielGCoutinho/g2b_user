import React, { useState } from 'react';
import './PlayerSelection.css';
import arenaBg from './assets/arena.png'; // <-- ESSENCIAL: Importar arenaBg para a tag <img>

// Array de avatares disponíveis.
import avatar1 from './avatars/avatar1.png';
import avatar2 from './avatars/avatar2.png';
import avatar3 from './avatars/avatar3.png';
import avatar4 from './avatars/avatar4.png';
import avatar5 from './avatars/avatar5.png';

const avatars = [
  { id: 'avatar1', src: avatar1, alt: 'Avatar 1' },
  { id: 'avatar2', src: avatar2, alt: 'Avatar 2' },
  { id: 'avatar3', src: avatar3, alt: 'Avatar 3' },
  { id: 'avatar4', src: avatar4, alt: 'Avatar 4' },
  { id: 'avatar5', src: avatar5, alt: 'Avatar 5' },
];

function PlayerSelection({ onClose, onSelectAvatar }) {
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

  const showNextAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => 
      (prevIndex + 1) % avatars.length
    );
  };

  const showPrevAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => 
      (prevIndex - 1 + avatars.length) % avatars.length
    );
  };

  const handleChooseAvatar = () => {
    onSelectAvatar(avatars[currentAvatarIndex].src);
    onClose();
  };

  const currentAvatar = avatars[currentAvatarIndex];

  return (
    <div className="player-selection-overlay">
      <div className="player-selection-modal">
        <button className="close-button" onClick={onClose} aria-label="Fechar Seleção">X</button>
        <h3>Selecione seu Avatar</h3>

        {/* NOVO: Container que gerencia a exibição da imagem da arena e do conteúdo */}
        <div className="arena-display-wrapper">
          {/* A imagem da arena como um elemento IMG */}
          <img src={arenaBg} alt="Arena Background" className="arena-background-img" />
          
          {/* O CONTEÚDO (carrossel e botão) POSICIONADO ABSOLUTAMENTE SOBRE A IMAGEM DA ARENA */}
          <div className="modal-content-area">
            {/* O carrossel de avatares será posicionado fixamente */}
            <div className="carousel-container"> 
              <button className="carousel-nav-button prev" onClick={showPrevAvatar} aria-label="Avatar Anterior">&#9664;</button>
              <img src={currentAvatar.src} alt={currentAvatar.alt} className="current-carousel-avatar-img"/>
              <button className="carousel-nav-button next" onClick={showNextAvatar} aria-label="Próximo Avatar">&#9654;</button>
            </div>
            
            {/* O botão "Escolher" também será posicionado fixamente */}
            <button className="choose-avatar-button" onClick={handleChooseAvatar}>Escolher</button>
          </div> {/* Fim modal-content-area */}
        </div> {/* Fim arena-display-wrapper */}

      </div>
    </div>
  );
}

export default PlayerSelection;