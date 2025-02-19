import _debounce from '../../lib/lodash/debounce';
import isEqual from '../../lib/lodash/isEqual';

export { isEqual };

export interface DebouncedFunction extends Function {
  cancel: () => void;
  flush: () => void;
}

export function debounce(func: any, wait?: number, options?: any): DebouncedFunction {
  return _debounce(func, wait, options) as DebouncedFunction;
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}
export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}
export function isString(value: any): value is string {
  return typeof value === 'string';
}
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object';
}

// We intentionally set the types to any to avoid circular deps
export function mergeOptions(defaultOptions: any, options?: any) {
  const defaultIcons = defaultOptions.icons;
  const optionsIcons = options?.icons;
  const mergedIcons = { ...defaultIcons, ...optionsIcons };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  mergedOptions.icons = mergedIcons;
  return mergedOptions;
}
