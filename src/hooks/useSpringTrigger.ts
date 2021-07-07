import { useSpring } from "@react-spring/web";
import { h } from "preact";
import { useMemo } from 'preact/hooks';

export function useDirectSpring(props: h.JSX.CSSProperties) {
  const springProps = useSpring(props) as {
    [Key in keyof h.JSX.CSSProperties]: {
      to: <T>(valueBuilder: (v: h.JSX.CSSProperties[Key]) => T) => T;
    }
  };

  return Object.keys(springProps).reduce((props, key) => ({
    ...props,
    [key]: springProps[key].to((v) => v),
  }), {} as h.JSX.CSSProperties);
}

export default function useSpringTrigger<T>(summariseState: () => T, assembleProps: (arg: T) =>  h.JSX.CSSProperties, deps: unknown[] = []): [h.JSX.CSSProperties, T] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [props, a] = useMemo(() => ((a: T): [h.JSX.CSSProperties, T] => [assembleProps(a), a])(summariseState()), deps);
  return [useDirectSpring(props), a];
}