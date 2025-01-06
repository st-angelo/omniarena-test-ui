import { useState } from 'react';
import Corner from './Corner';
import Highlight from './Highlight';
import { resetTargeting, targetingStore } from '../stores';

function Board({ board, onNext, onSurrender }) {
  const [nextDisabled, setNextDisabled] = useState(false);

  async function handleNextClick() {
    if (!targetingStore.isEmpty) resetTargeting();
    setNextDisabled(true);
    await onNext();
    setTimeout(() => {
      setNextDisabled(false);
    }, 500);
  }

  return (
    <div id="board">
      <div id="corner-panel">
        {board.corners.map((corner, index) => (
          <Corner
            key={corner.id}
            corner={corner}
            isPlayer={index === 0}
            active={corner.id === board.currentCornerId}
          />
        ))}
      </div>
      <div id="board-footer">
        <div id="action-panel">
          <button
            className="action"
            onClick={handleNextClick}
            disabled={nextDisabled}
          >
            Next
          </button>
          <button className="action">Mute</button>
          <button className="action" onClick={onSurrender}>
            Surrender
          </button>
        </div>
        <Highlight />
      </div>
    </div>
  );
}

export default Board;
