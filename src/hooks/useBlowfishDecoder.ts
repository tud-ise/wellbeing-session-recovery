import Blowfish from 'egoroof-blowfish';
import md5 from "crypto-js/md5";
import { useMemo } from 'preact/hooks';
import { Possible } from './utils';

export function decodeBlowfish(input: Possible<string>, key: Possible<string>): string | null {
  if (!input || !key) {
    return null;
  }

  const m = input.match(/.{1,2}/g);
  if (!m) {
    return null;
  }

  const data = new Uint8Array(m.map(byte => parseInt(byte, 16)));
  return new Blowfish(key, 
    Blowfish.MODE.ECB,
    Blowfish.PADDING.NULL,
  ).decode(data).toString();
}

export function decodeMD5Blowfish(input: Possible<string>, key: Possible<string>): string | null {
  return decodeBlowfish(input, key ? md5(key).toString() : null);
}

export default function useBlowfishDecoder(input: Possible<string>, key: Possible<string>): string | null {
  return useMemo(() => decodeBlowfish(input, key), [input, key]);
}

export function useMD5BlowfishDecoder(input: Possible<string>, key: Possible<string>): string | null {
  const rawKey = useMemo(() => key ? md5(key).toString() : null, [key]);
  return useBlowfishDecoder(input, rawKey);
}