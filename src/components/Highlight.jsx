import { enumResourceToString } from '../constants';
import { useReactiveStore } from '../reactiveStore';
import { highlightStore } from '../stores';

function Highlight() {
  const [highlight] = useReactiveStore(highlightStore);

  return (
    <div id="highlight">
      {highlight && (
        <>
          <img id="highlight-icon" src={highlight.icon} />
          <div id="highlight-details-panel">
            <span id="highlight-title">{highlight.title}</span>
            <span id="highlight-description">{highlight.description}</span>
            {highlight.cost && (
              <div className="cost-panel">
                {highlight.cost.map((resource) => (
                  <div
                    key={crypto.randomUUID()}
                    className="resource"
                    data-type={enumResourceToString[resource]}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Highlight;
