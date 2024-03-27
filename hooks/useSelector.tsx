import React, { useContext, useEffect, useMemo, useState } from 'react';

export default function useSelector<TContext, TSelected>(
  context: React.Context<TContext>,
  selector: (value: TContext) => TSelected
): TSelected {
  const contextValue = useContext(context);
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(contextValue)
  );

  useEffect(() => {
    const newValue = selector(contextValue);
    // Implement or import a shallowEqual function as needed. This function should
    // compare the old value and the new value, and return true if they are equal.
    // Redux provides a shallowEqual function you might use if already using Redux.
    if (!shallowEqual(newValue, selectedValue)) {
      console.log('Updates');
      setSelectedValue(newValue);
    }
  }, [contextValue, selector, selectedValue]); // Depend on `contextValue`.

  return selectedValue;
}

function shallowEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
