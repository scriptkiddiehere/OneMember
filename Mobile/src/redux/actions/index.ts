export const setAuth = (value: any) => {
  return {
    type: 'SET_AUTH',
    payload: value,
  };
};
export const setUser = (value: any) => {
  return {
    type: 'SET_USER',
    payload: value,
  };
};
export const setSuggestions = (value: any) => {
  return {
    type: 'SET_SUGGESTION',
    payload: value,
  };
};
