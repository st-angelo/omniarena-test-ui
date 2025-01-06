import { enumResourceToString } from '../constants';
import { useReactiveStore } from '../reactiveStore';
import {
  currentCornerStore,
  randomEnergiesPickedStore,
  resourcesStore,
} from '../stores';

function RandomEnergySelector({ onNext, onClose }) {
  const [currentCornerId] = useReactiveStore(currentCornerStore);
  const [resources] = useReactiveStore(resourcesStore);
  const [randomEnergiesPicked, , updateRandomEnergiesPicked] = useReactiveStore(
    randomEnergiesPickedStore
  );

  const cornerResources = resources[currentCornerId];

  const modifiedResources = (() => {
    const value = { ...cornerResources };
    Object.keys(value).forEach((resource) => {
      if (resource === 'randomsUsed') return;
      for (const picked of randomEnergiesPicked) {
        console.log(picked === Number(resource));
        if (picked === Number(resource)) value[resource]--;
      }
    });
    return value;
  })();

  function pickResource(resource) {
    updateRandomEnergiesPicked((prev) => [...prev, Number(resource)]);
  }

  function unpickResource(resource) {
    if (modifiedResources[resource] >= cornerResources[resource]) return;
    const index = randomEnergiesPicked.indexOf(Number(resource));
    if (index === -1) return;
    updateRandomEnergiesPicked((prev) => {
      prev.splice(index, 1);
      return prev;
    });
  }

  console.log('xddddd', modifiedResources);
  console.log(
    'lolol',
    randomEnergiesPicked.length,
    cornerResources,
    cornerResources.randomsUsed !== randomEnergiesPicked.length
  );

  return (
    <div className="energy-selector">
      {Object.keys(modifiedResources)
        .filter((resource) => resource !== 'randomsUsed')
        .map((resource) => {
          console.log(modifiedResources[resource]);
          return (
            <div key={crypto.randomUUID()} className="energy-selector-resource">
              <button
                className="energy-selector-control"
                disabled={modifiedResources[resource] === 0}
                onClick={() => pickResource(resource)}
              >
                -
              </button>
              <div
                className="resource"
                data-type={enumResourceToString[resource]}
              ></div>
              <span>x {modifiedResources[resource]}</span>
              <button
                className="energy-selector-control"
                onClick={() => unpickResource(resource)}
              >
                +
              </button>
            </div>
          );
        })}
      <div className="energy-selector-actions">
        <button
          className="action"
          disabled={cornerResources.randomsUsed !== randomEnergiesPicked.length}
          onClick={onNext}
        >
          Ok
        </button>
        <button className="action" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default RandomEnergySelector;
