import { useCallback, useEffect, useState } from 'preact/hooks';

export default function useAsyncMemo<T>(f: () => Promise<T>, initial: T, deps: unknown[]) {
  const [data, setData] = useState(initial);
  
  const loadData = useCallback(async () => {
    const d = await f();
    setData(d);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => void loadData(), [loadData]);

  return data;
}