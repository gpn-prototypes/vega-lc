function deepMerge(...args: any) {
  const newObj: { [x: string]: any } = {};

  const merge = (obj: any) => {
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
