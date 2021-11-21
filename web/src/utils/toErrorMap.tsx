import { PathError } from "../generated/graphql";

export const toErrorMap = (errors: PathError[]) => {
  const errorMap: Record<string, string> = {};

  errors.forEach(({ path, message }) => {
    errorMap[path] = message;
  });

  return errorMap;
};
