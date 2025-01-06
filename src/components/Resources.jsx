import { Tooltip } from 'react-tooltip';
import { toPascalCase } from '../utils';
import { enumResourceToString } from '../constants';

function Resources({ resources }) {
  return (
    <div className="resources">
      {Object.keys(resources).map((resource) => (
        <>
          <div
            className="resource"
            key={resource}
            data-type={enumResourceToString[resource]}
          >
            <Tooltip
              id={resource}
              place="top"
              content={toPascalCase(resource)}
            />
          </div>
          <span className="resource-label">{resources[resource]}</span>
        </>
      ))}
    </div>
  );
}

export default Resources;
