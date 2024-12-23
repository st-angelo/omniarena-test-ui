import { iconMap } from '../constants';
import { useReactiveStore } from '../reactiveStore';
import {
  highlightStore,
  queuedSkillsStore,
  resetTargeting,
  targetingOptionsStore,
  targetingStore,
  targetsStore,
  validTargetsStore,
} from '../stores';

function Skill({ skill, active }) {
  const [queuedSkills] = useReactiveStore(queuedSkillsStore);

  const isQueued = queuedSkills.some(queuedSkill => queuedSkill.id === skill.id);

  const hasValidTargets = skill.validTargets.length > 0;

  const onCooldown = skill.cooldown > 0;

  function handleClick() {
    if (isQueued) {
      queuedSkillsStore.update(prev => prev.filter(queuedSkill => queuedSkill.id !== skill.id));
      return;
    }
    highlightStore.set({
      icon: iconMap[skill.code],
      title: skill.code,
      description: skill.description,
    });
    if (targetingStore.get() === skill.id) {
      resetTargeting();
      return;
    }
    if (!onCooldown && hasValidTargets && active) {
      targetingStore.set(skill.id);
      targetingOptionsStore.set(skill.targetingOptions);
      validTargetsStore.set(skill.validTargets);
      targetsStore.set([]);
    }
  }

  return (
    <div
      className={`skill ${!hasValidTargets || !active ? 'inactive' : ''} ${
        isQueued ? 'queued' : ''
      } ${onCooldown ? 'on-cooldown' : ''}`}
      onClick={handleClick}
    >
      <img className="icon" src={iconMap[skill.code]} />
      <div className="queued-overlay">X</div>
      <div className="cooldown-overlay">{skill.cooldown}</div>
    </div>
  );
}

export default Skill;
