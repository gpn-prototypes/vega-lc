type mergedObject = { [x: string]: unknown };

function deepMerge(...args: any): mergedObject {
  const newObj: mergedObject = {};

  const merge = (obj: mergedObject): void => {
    Object.keys(obj).forEach((prop) => {
      if (typeof obj[prop] === 'object') {
        newObj[prop] = deepMerge(newObj[prop] || {}, obj[prop]);
      } else {
        newObj[prop] = obj[prop];
      }
    });
  };

  args.forEach((arg: any) => merge(arg));

  return newObj;
}

export default deepMerge;
