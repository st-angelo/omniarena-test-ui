import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

function HealthBar({ value, maxValue }) {
  const [previousValue, setPreviousValue] = useState(value);
  const [internalValue, setInternalValue] = useState(value);

  const tweenInterval = useRef();

  useEffect(() => {
    if (previousValue) {
      const difference = Math.abs(value - previousValue);
      const modifier = value > previousValue ? 1 : -1;
      clearInterval(tweenInterval.current);
      tweenInterval.current = setInterval(() => {
        setInternalValue(prev => {
          if (prev === value) {
            setPreviousValue(value);
            clearInterval(tweenInterval.current);
            return prev;
          } else {
            return prev + 1 * modifier;
          }
        });
      }, 500 / difference);
    }
  }, [previousValue, value]);

  return (
    <div className="health-bar">
      <div
        className="progress"
        data-type={value <= 40 ? 'critical' : value <= 70 ? 'wounded' : 'healthy'}
        style={{ width: `${value}%` }}
      ></div>
      <span className="health-bar-label">{internalValue}</span>
    </div>
  );
}

export default HealthBar;
