import Character from './Character';
import Resources from './Resources';

function Corner({ corner, isPlayer, active }) {
  return (
    <div className={`corner ${isPlayer ? 'is-player' : ''}`}>
      <Resources resources={corner.resources} />
      {corner.characters.map((character) => (
        <Character
          key={character.id}
          character={character}
          isPlayer={isPlayer}
          active={active}
        />
      ))}
    </div>
  );
}

export default Corner;
