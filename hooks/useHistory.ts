import { useCallback, useRef, useState } from "react";

type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function useHistory<T>(initial: T) {
  const [state, setState] = useState<History<T>>({
    past: [],
    present: initial,
    future: [],
  });
  const lastPushAt = useRef<number>(0);

  const set = useCallback((next: T) => {
    setState((prev) => {
      if (Object.is(prev.present, next)) return prev;
      const now = Date.now();
      const collapse = now - lastPushAt.current < 400;
      lastPushAt.current = now;
      return {
        past: collapse ? prev.past : [...prev.past, prev.present],
        present: next,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: prev.future.slice(1),
      };
    });
  }, []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
