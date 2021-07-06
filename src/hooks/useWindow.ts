import { useCallback, useMemo, useState } from 'preact/hooks';
import { IndexSignature } from './utils';

export default function useWindow<T>(values: Array<T>, initalPaginationProps = {
  size: 10,
  offset: 0,
}): [Array<T>, Array<string>, { forward: () => void; backward: () => void; values: Array<T> } & typeof initalPaginationProps] {
  const [{ size, offset }, setPaginationProps] = useState(initalPaginationProps);
  return [
    useMemo(() => values.filter((v, i) => i > offset && i < offset + size), [size, offset, values]),
    useMemo(() => Object.keys(values.reduce((acc, val) => ({
      ...acc,
      ...Object.keys(val).reduce((acc, k) => ({...acc, [k]: true }), { id: true } as IndexSignature<boolean>),
    }), {} as IndexSignature<boolean>)), [values]),
    {
      size,
      offset,
      forward: useCallback(() => setPaginationProps({
        size,
        offset:  offset + size < values.length ? offset + size : values.length,
      }), [offset, size, values.length]),
      backward: useCallback(() => setPaginationProps({
        size,
        offset:  offset - size >= 0 ? offset - size : 0,
      }), [offset, size]),
      values,
    }
  ]
}