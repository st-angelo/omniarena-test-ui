import { iconMap } from '../constants';
import { Tooltip } from 'react-tooltip';

function Effect({ effect }) {
  return (
    <div className="effect">
      <img data-tooltip-id={effect.id} className="icon mini" src={iconMap[effect.skillCode]} />
      <Tooltip id={effect.id} place="top" content={`${effect.description}`} />
    </div>
  );
}

export default Effect;
