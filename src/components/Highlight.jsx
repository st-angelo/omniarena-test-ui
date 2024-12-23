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
          </div>
        </>
      )}
    </div>
  );
}

export default Highlight;
