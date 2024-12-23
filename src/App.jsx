import { useState } from 'react';
import { sleep } from './utils';
import Board from './components/Board';
import QueuedSkillsMonitor from './components/QueuedSkillsMonitor';
import { queuedSkillsStore } from './stores';

function App() {
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [board, setBoard] = useState(null);

  async function startGame() {
    setSearching(true);
    setFailed(false);

    try {
      await sleep(500);

      const response = await fetch('https://localhost:7234/api/Game/start', { method: 'POST' });
      if (!response.ok) throw new Error('Something went wrong!');

      const newBoard = await response.json();
      setBoard(newBoard);
      setSearching(false);
      setPlaying(true);
    } catch (error) {
      setFailed(true);
      setSearching(false);
      return;
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
      setBoard(newBoard);
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
