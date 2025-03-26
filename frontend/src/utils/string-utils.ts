import s from 'underscore.string';

export const shortDeviceName = (fullName: string): string => {
  const comPortMatch = fullName.match(/\(COM\d+\)/);

  if (comPortMatch) {
    return `USB ${comPortMatch[0]}`;
  }

  if (fullName.length > 25) {
    return s.truncate(fullName, 25);
  }

  return fullName;
};

export const contains = (str: string, substring: string): boolean => {
  return s.include(str, substring);
};

export const truncate = (str: string, length: number): string => {
  return s.truncate(str, length);
};

export const capitalize = (str: string): string => {
  return s.capitalize(str);
};

export const camelize = (str: string): string => {
  return s.camelize(str);
};

export const trim = (str: string): string => {
  return s.trim(str);
};

export const stripTags = (str: string): string => {
  return s.stripTags(str);
};

export const stringUtils = s; 