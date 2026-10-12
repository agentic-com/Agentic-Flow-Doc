import type en from './en';
export type UIKey = keyof typeof en;
export type Dict = Record<UIKey, string>;
