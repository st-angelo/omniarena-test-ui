import { useReactiveStore } from '../reactiveStore';
import {
  highlightStore,
  queuedSkillsStore,
  targetingStore,
  targetsStore,
  validTargetsStore,
} from '../stores';
import Effect from './Effect';
import HealthBar from './HealthBar';
import Skill from './Skill';

function Character({ character, isPlayer, active }) {
  const [validTargets] = useReactiveStore(validTargetsStore);
  const [targets, , updateTargets] = useReactiveStore(targetsStore);
  const [targeting] = useReactiveStore(targetingStore);
  const [queuedSkills] = useReactiveStore(queuedSkillsStore);

  const isTargeted = targets.includes(character.id);

  const isValidTarget = validTargets.includes(character.id) && !isTargeted;

  function handleClick() {
    if (!isValidTarget && !isTargeted)
      highlightStore.set({
        icon: 'facepic.jpg',
        title: character.code,
        description: character.description,
      });
    else if (!isTargeted) {
      updateTargets((prev) => [...prev, character.id]);
    }
    if (isTargeted) {
      updateTargets((prev) => prev.filter((id) => id !== character.id));
    }
  }

  const localEffects = (() => {
    const effects = [];
    for (const effect of character.effects) {
      const existingEffect = effects.find(
        (e) =>
          e.description === effect.description && e.duration === effect.duration
      );
      if (existingEffect) existingEffect.count++;
      else {
        effects.push({ ...effect, count: 1 });
      }
    }
    return effects;
  })();
  queuedSkills
    .filter((queuedSkill) => queuedSkill.targets.includes(character.id))
    .forEach((queuedSkill) => {
      localEffects.push({
        id: crypto.randomUUID(),
        skillCode: queuedSkill.skillCode,
        description: '',
        queued: true,
      });
    });
  if (targets.includes(character.id)) {
    localEffects.push({
      id: crypto.randomUUID(),
      skillCode: targeting.skillCode,
      description: '',
      queued: true,
    });
  }

  return (
    <div
      className={`character ${isPlayer ? 'is-player' : ''} ${
        character.dead ? 'dead' : ''
      } ${isValidTarget ? 'valid-target' : ''} ${isTargeted ? 'targeted' : ''}`}
    >
      <div className="avatar-panel">
        <div className="avatar-container">
          <img
            className="avatar icon"
            src="facepic.jpg"
            onClick={handleClick}
          />
          <div className="selection-overlay"></div>
          <img className="border" src="border.png" />
        </div>
        <HealthBar
          value={character.currentHealth}
          maxValue={character.maxHealth}
        />
      </div>
      <div className="character-details">
        <div className="effect-panel">
          {localEffects.map((effect) => (
            <Effect key={effect.id} effect={effect} />
          ))}
        </div>
        <div className="skill-panel">
          {character.skills.map((skill) => (
            <Skill
              key={skill.id}
              skill={skill}
              active={!character.dead && active}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Character;
