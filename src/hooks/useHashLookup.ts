import sha256 from "crypto-js/sha256";
import { useMemo } from 'preact/hooks';
import { IndexSignature, Possible } from './utils';

export default function useSHA256Lookup<T>(key: Possible<string>, values: IndexSignature<T>): Possible<T> {
  return useMemo(() => key ? values[sha256(key).toString()] : undefined, [key, values]);
}