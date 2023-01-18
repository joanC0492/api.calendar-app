import { isValid } from "date-fns";

export const isDate = (value: unknown) => {
  if (!value) return false;
  return isValid(value);
};