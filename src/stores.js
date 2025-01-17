import { ReactiveStore } from './reactiveStore';

export const resourcesStore = new ReactiveStore({});

export const nextResourcesStore = new ReactiveStore(null);

export const highlightStore = new ReactiveStore(null);

export const targetingStore = new ReactiveStore(null);

export const validTargetsStore = new ReactiveStore([]);

export const targetsStore = new ReactiveStore([]);

export const targetingOptionsStore = new ReactiveStore(null);

export const queuedSkillsStore = new ReactiveStore([]);

export const deadAlliesStore = new ReactiveStore(0);

export const deadEnemiesStore = new ReactiveStore(0);

export const currentCornerStore = new ReactiveStore(null);

export const randomEnergiesPickedStore = new ReactiveStore([]);

export function resetTargeting() {
  targetingStore.set(null);
  validTargetsStore.set([]);
  targetsStore.set([]);
  targetingOptionsStore.set(null);
  nextResourcesStore.set(null);
}
