import { useState } from 'react';
import { sleep } from './utils';
import Board from './components/Board';
import QueuedSkillsMonitor from './components/QueuedSkillsMonitor';
import {
  currentCornerStore,
  deadAlliesStore,
  deadEnemiesStore,
  queuedSkillsStore,
  randomEnergiesPickedStore,
  resourcesStore,
} from './stores';
import RandomEnergySelector from './components/RandomEnergySelector';

function App() {
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [board, setBoard] = useState(null);
  const [energySelectorShown, setEnergySelectorShown] = useState(false);

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
    for (const corner of newBoard.corners) {
      resourcesStore.update((prev) => ({
        ...prev,
        [corner.id]: {
          ...corner.resources,
          randomsUsed: 0,
        },
      }));
    }
    currentCornerStore.set(newBoard.currentCornerId);
    setBoard(newBoard);
  }

  async function startGame() {
    setSearching(true);
    setFailed(false);

    try {
      await sleep(500);

      const response = await fetch('https://localhost:7234/api/Game/start', {
        method: 'POST',
      });
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

  async function checkNextTurn() {
    const resources = resourcesStore.get();
    const hasRandomsUsed = resources[board.currentCornerId].randomsUsed > 0;
    if (hasRandomsUsed) {
      setEnergySelectorShown(true);
      return;
    }
    await nextTurn();
  }

  async function nextTurn() {
    try {
      const response = await fetch(
        `https://localhost:7234/api/Game/tick/${board.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            queuedActions: queuedSkillsStore
              .get()
              .map(({ skillId, targets }) => ({
                skillId,
                targets,
                type: 'skill',
              })),
            randomsUsed: randomEnergiesPickedStore.get(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Something went wrong!');
      closeEnergySelector();
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

  function closeEnergySelector() {
    randomEnergiesPickedStore.set([]);
    setEnergySelectorShown(false);
  }

  return (
    <main>
      {!playing && (
        <div id="start-panel">
          {searching && <span>Searching...</span>}
          {failed && (
            <span style={{ color: 'orangered' }}>Something went wrong!</span>
          )}
          <button id="start-button" onClick={startGame} disabled={searching}>
            Start
          </button>
        </div>
      )}
      {playing && (
        <Board board={board} onNext={checkNextTurn} onSurrender={surrender} />
      )}
      <QueuedSkillsMonitor />
      {energySelectorShown && (
        <RandomEnergySelector onNext={nextTurn} onClose={closeEnergySelector} />
      )}
    </main>
  );
}

export default App;
