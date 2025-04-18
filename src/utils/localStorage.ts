/* eslint-disable @typescript-eslint/no-explicit-any */
export const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };