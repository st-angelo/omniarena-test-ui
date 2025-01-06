import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

export class ReactiveStore {
  #subscribers;
  #data;

  constructor(initial) {
    this.#subscribers = [];
    this.#data = initial;
  }

  subscribe(subscriber) {
    this.#subscribers.push(subscriber);
    return () => {
      this.#subscribers.splice(this.#subscribers.indexOf(subscriber), 1);
    };
  }

  get() {
    return this.#data;
  }

  set(data) {
    this.#data = data;
    this.#notify();
  }

  update(updateFn) {
    this.#data = updateFn(this.#data);
    this.#notify();
  }

  #notify() {
    this.#subscribers.forEach((subscriber) => subscriber(this.#data));
  }

  get isEmpty() {
    return !this.#data;
  }
}

export function useReactiveStore(store) {
  const [data, setData] = useState(() => store.get());

  useEffect(() => {
    return store.subscribe((_data) => {
      if (typeof _data === 'function') setData(() => _data);
      else setData(_data);
    });
  }, [store]);

  const update = useCallback(
    (updateFn) => {
      store.update(updateFn);
    },
    [store]
  );

  const set = useCallback(
    (data) => {
      store.set(data);
    },
    [store]
  );

  return [data, set, update];
}
