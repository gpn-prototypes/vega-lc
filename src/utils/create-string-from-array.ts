type initialArr = number[] | string[];

const createStringFromArray = (
  array: initialArr,
  extra?: string | number | initialArr,
): string | undefined => {
  if (!Array.isArray(array)) {
    return undefined;
  }

  let resultString = '';

  const create = (arr: initialArr): void => {
    arr.forEach((i: number | string) => {
      resultString += `"${i}",`;
    });
  };

  create(array);

  if (extra) {
    if (Array.isArray(extra)) {
      create(extra);

      return resultString;
    }

    resultString += `"${extra}"`;
  }

  return resultString;
};

export default createStringFromArray;
