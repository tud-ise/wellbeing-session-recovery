import { useCallback, useEffect, useState } from 'preact/hooks';
import { Possible } from './utils';

export function useRemote<T>(url: Possible<string>, format: "json" | "text", initial: T, deps: unknown[] = []): T {
  const [data, setData] = useState(initial);
  
  const loadData = useCallback(async () => {
    if (!url) {
      return;
    }

    const req = await fetch(url);
    setData(await req[format]());
  }, [url, format])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void loadData(), [loadData, ...deps]);

  return data;
}

export function useRemoteText<T>(url: Possible<string>, initial: T, deps: unknown [] = []): T {
  return useRemote<T>(url, "text", initial, deps);
}

export default function useRemoteJSON<T>(url: Possible<string>, initial: T, deps: unknown [] = []): T {
  return useRemote<T>(url, "json", initial, deps);
}