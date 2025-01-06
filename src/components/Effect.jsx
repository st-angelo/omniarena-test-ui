import { iconMap } from '../constants';
import { Tooltip } from 'react-tooltip';

function Effect({ effect }) {
  const localDuration =
    effect.duration > 0
      ? effect.duration
      : effect.endsThisTurn
      ? effect.duration
      : 1;

  return (
    <div className={`effect ${effect.queued ? 'queued' : ''}`}>
      <img
        data-tooltip-id={effect.id}
        className="icon mini"
        src={iconMap[effect.skillCode]}
      />
      {!effect.queued && (
        <Tooltip
          id={effect.id}
          place="top"
          content={
            <div className="effect-description">
              <span className="effect-content">{effect.description}</span>
              <span className="effect-duration">
                {effect.isPermanent
                  ? 'Permanent'
                  : effect.endsThisTurn
                  ? 'Ends this turn'
                  : `Ends in ${localDuration} turn${
                      localDuration > 1 ? 's' : ''
                    }.`}
              </span>
            </div>
          }
        />
      )}
      {effect.count > 1 && <span className="effect-count">{effect.count}</span>}
    </div>
  );
}

export default Effect;
