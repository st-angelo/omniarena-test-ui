import Character from './Character';

function Corner({ corner, isPlayer, active }) {
  return (
    <div className="corner">
      {corner.characters.map(character => (
        <Character key={character.id} character={character} isPlayer={isPlayer} active={active} />
      ))}
    </div>
  );
}

export default Corner;
