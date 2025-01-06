import { iconMap, stringResourceToEnum } from '../constants';
import { useReactiveStore } from '../reactiveStore';
import {
  highlightStore,
  nextResourcesStore,
  queuedSkillsStore,
  resetTargeting,
  resourcesStore,
  targetingOptionsStore,
  targetingStore,
  targetsStore,
  validTargetsStore,
} from '../stores';

function Skill({ skill, active }) {
  const [queuedSkills] = useReactiveStore(queuedSkillsStore);
  const [resources] = useReactiveStore(resourcesStore);

  const isQueued = queuedSkills.some(
    (queuedSkill) => queuedSkill.skillId === skill.id
  );

  const hasValidTargets = skill.validTargets.length > 0;

  const onCooldown = skill.cooldown > 0;

  const characterQueuedSkill = queuedSkills.find(
    (queuedSkill) => queuedSkill.userId === skill.characterId
  );

  const resourcesAfterSpending = getResourcesAfterSpending(
    skill.cost,
    skill.cornerId,
    resources
  );

  const hasEnoughResources = resourcesAfterSpending !== null;

  function handleClick() {
    if (isQueued) {
      queuedSkillsStore.update((prev) =>
        prev.filter((queuedSkill) => queuedSkill.skillId !== skill.id)
      );
      const newResources = { ...resources };
      for (const resource of skill.cost) {
        if (resource === stringResourceToEnum['random'])
          newResources[skill.cornerId].randomsUsed--;
        else {
          newResources[skill.cornerId][resource]--;
        }
      }
      console.log(newResources);
      resourcesStore.set(newResources);
      return;
    }
    highlightStore.set({
      icon: iconMap[skill.code],
      title: skill.code,
      description: skill.description,
      cost: skill.cost,
    });
    if (characterQueuedSkill) return;
    if (!targetingStore.isEmpty && targetingStore.get().skillId === skill.id) {
      resetTargeting();
      return;
    }
    if (!onCooldown && hasValidTargets && active && hasEnoughResources) {
      targetingStore.set({
        skillId: skill.id,
        skillCode: skill.code,
        userId: skill.characterId,
      });
      targetingOptionsStore.set(skill.targetingOptions);
      validTargetsStore.set(skill.validTargets);
      targetsStore.set([]);
      nextResourcesStore.set(resourcesAfterSpending);
    }
  }

  return (
    <div
      className={`skill ${
        !hasValidTargets ||
        !active ||
        !hasEnoughResources ||
        (characterQueuedSkill && characterQueuedSkill.skillId !== skill.id)
          ? 'inactive'
          : ''
      } ${isQueued ? 'queued' : ''} ${onCooldown ? 'on-cooldown' : ''}`}
      onClick={handleClick}
    >
      <img className="icon" src={iconMap[skill.code]} />
      <div className="queued-overlay">X</div>
      <div className="cooldown-overlay">{skill.cooldown}</div>
    </div>
  );
}

export default Skill;

function getResourcesAfterSpending(cost, cornerId, resources) {
  const cornerResources = { ...resources[cornerId] };
  let randoms = 0;
  for (const resource of cost) {
    if (resource === stringResourceToEnum['random']) randoms++;
    else {
      if (cornerResources[resource] === 0) return null;
      else cornerResources[resource]--;
    }
  }
  const resourcesLeft = Object.keys(cornerResources).reduce((total, key) => {
    if (key === 'randomsUsed') return total;
    return total + cornerResources[key];
  }, 0);
  if (randoms > resourcesLeft - cornerResources.randomsUsed) return null;
  cornerResources.randomsUsed += randoms;
  return { ...resources, [cornerId]: cornerResources };
}
