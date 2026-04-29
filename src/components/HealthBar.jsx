import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

function HealthBar({ value, maxValue }) {
  const [previousValue, setPreviousValue] = useState(value);
  const [internalValue, setInternalValue] = useState(value);

  const tweenInterval = useRef();

  const normalizedValue = value < 0 ? 0 : value;

  useEffect(() => {
    if (previousValue) {
      const difference = Math.abs(normalizedValue - previousValue);
      const modifier = normalizedValue > previousValue ? 1 : -1;
      clearInterval(tweenInterval.current);
      tweenInterval.current = setInterval(() => {
        setInternalValue((prev) => {
          if (prev === normalizedValue) {
            setPreviousValue(normalizedValue);
            clearInterval(tweenInterval.current);
            return prev;
          } else {
            return prev + 1 * modifier;
          }
        });
      }, 500 / difference);
    }
  }, [previousValue, normalizedValue]);

  return (
    <div className="health-bar">
      <div
        className="progress"
        data-type={
          normalizedValue <= 40
            ? 'critical'
            : normalizedValue <= 70
              ? 'wounded'
              : 'healthy'
        }
        style={{ width: `${normalizedValue}%` }}
      ></div>
      <span className="health-bar-label">{internalValue}</span>
    </div>
  );
}

export default HealthBar;
