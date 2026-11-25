import { useSyncExternalStore } from 'react';

/* 
  Zustand Micro-Store Implementation (Syllabus Module 2: Introduction to Redux Toolkit or Zustand)
  - Implements the exact public API & philosophy of Zustand:
    `const useStore = create((set, get) => ({ state, action }))`
  - Leverages React 19 native `useSyncExternalStore` for tear-free selective reactivity
  - Supports selectors `useStore(state => state.property)` to prevent unnecessary re-renders
  - Allows reads and writes outside the React render cycle
*/
export function create(createState) {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      state = replace ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener());
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState, api);

  const useBoundStore = (selector = (s) => s) => {
    return useSyncExternalStore(
      subscribe,
      () => selector(getState()),
      () => selector(getState())
    );
  };

  Object.assign(useBoundStore, api);
  return useBoundStore;
}
