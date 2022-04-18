import { paramCase } from 'change-case';

export function toCSSVars(obj: { [k: string]: string; }) {
  return Object.fromEntries(Object.entries(obj).map(([ key, value ]) => [`--${ paramCase(key) }` as string, value]));
}