import { useState } from 'react';
import { sleep } from './utils';
import Board from './components/Board';
import QueuedSkillsMonitor from './components/QueuedSkillsMonitor';
import { deadAlliesStore, deadEnemiesStore, queuedSkillsStore } from './stores';

function App() {
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [board, setBoard] = useState(null);

  function assignBoard(newBoard) {
    let deadAllies = 0;
    let deadEnemies = 0;
    for (const character of newBoard.corners[0].characters) {
      if (character.dead) deadAllies++;
    }
    for (const character of newBoard.corners[1].characters) {
      if (character.dead) deadEnemies++;
    }
    deadAlliesStore.set(deadAllies);
    deadEnemiesStore.set(deadEnemies);
    setBoard(newBoard);
  }

  async function startGame() {
    setSearching(true);
    setFailed(false);

    try {
      await sleep(500);

      const response = await fetch('https://localhost:7234/api/Game/start', { method: 'POST' });
      if (!response.ok) throw new Error('Something went wrong!');

      const newBoard = await response.json();
      assignBoard(newBoard);
      setSearching(false);
      setPlaying(true);
    } catch (error) {
      console.error(error.message);
      setFailed(true);
      setSearching(false);
    }
  }

  async function nextTurn() {
    try {
      const response = await fetch(`https://localhost:7234/api/Game/tick/${board.id}`, {
        method: 'POST',
        body: JSON.stringify(queuedSkillsStore.get()),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Something went wrong!');
      queuedSkillsStore.set([]);
      const newBoard = await response.json();
      assignBoard(newBoard);
    } catch (error) {
      console.error(error.message);
    }
  }

  function surrender() {
    setPlaying(false);
    setBoard(null);
  }

  return (
    <main>
      {!playing && (
        <div id="start-panel">
          {searching && <span>Searching...</span>}
          {failed && <span style={{ color: 'orangered' }}>Something went wrong!</span>}
          <button id="start-button" onClick={startGame} disabled={searching}>
            Start
          </button>
        </div>
      )}
      {playing && <Board board={board} onNext={nextTurn} onSurrender={surrender} />}
      <QueuedSkillsMonitor />
    </main>
  );
}

export default App;
