import { useEffect } from 'react';
import { useReactiveStore } from '../reactiveStore';
import {
  nextResourcesStore,
  queuedSkillsStore,
  resetTargeting,
  resourcesStore,
  targetingOptionsStore,
  targetingStore,
  targetsStore,
  validTargetsStore,
} from '../stores';

function QueuedSkillsMonitor() {
  const [targets] = useReactiveStore(targetsStore);
  const [targetingOptions] = useReactiveStore(targetingOptionsStore);
  const [targeting] = useReactiveStore(targetingStore);
  const [validTargets] = useReactiveStore(validTargetsStore);

  useEffect(() => {
    if (!targeting || !targetingOptions) return;
    let valid = true;
    if (targetingOptions.self) {
      if (!(targets.length === 1)) valid = false;
    }
    if (targetingOptions.enemies === 1) {
      if (!(targets.length === 1)) valid = false;
    }
    if (targetingOptions.allEnemies) {
      if (!(targets.length === validTargets.length)) valid = false;
    }
    if (valid) {
      queuedSkillsStore.update((prev) => [
        ...prev,
        {
          skillId: targeting.skillId,
          skillCode: targeting.skillCode,
          userId: targeting.userId,
          targets,
        },
      ]);
      resourcesStore.set(nextResourcesStore.get());
      resetTargeting();
    }
  }, [targeting, targets, targetingOptions, validTargets]);

  return null;
}

export default QueuedSkillsMonitor;
