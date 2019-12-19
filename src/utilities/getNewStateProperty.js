// add new data
export const addNewStatePropertyData = (prevObj, newKey, newValue) => {
  const newObj = {};
  Object.keys(prevObj).forEach((key) => {
      const value = prevObj[key];
      newObj[key] = value;
    });
  if (Array.isArray(newKey)) {
    newKey.forEach((key) => {
      newObj[key] = newValue;
    });
  } else {
    newObj[newKey] = newValue;
  };

  return newObj;
};

// update single one value
export const getNewStateProperty = (prevObj, newKey, newValue) => {
  const newObj = {};
  Object.keys(prevObj).forEach((key) => {
    if (key === newKey) {
      newObj[key] = newValue;
    } else {
      const value = prevObj[key];
      newObj[key] = value;
    }
  });

  return newObj;
};

// update multiple keys to the same value: location_ship
export const getNewStatePropertyArray = (prevObj, newKeyArray, newValue) => {
  const newObj = {};
  const keySet = new Set(newKeyArray);
  Object.keys(prevObj).forEach((key) => {
    if (keySet.has(key)) {
      newObj[key] = newValue;
    } else {
      const value = prevObj[key];
      newObj[key] = value;
    }
  });

  return newObj;
};

// delete multiple keys to the same value: location_ship
export const getNewStatePropertyDelete = (prevObj, deleteKeyArray) => {
  console.log('delete helper function: ', prevObj, deleteKeyArray)
  const newObj = {};
  const keySet = new Set(deleteKeyArray);
  Object.keys(prevObj).forEach((key) => {
    if (!keySet.has(key)) {
      const value = prevObj[key];
      newObj[key] = value;
    };
  });
  console.log('delete helper result: ', newObj)
  return newObj;
};
