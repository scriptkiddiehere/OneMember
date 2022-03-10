import {combineReducers} from 'redux';

const INITIAL_STATE = {
  id: null,
  user: null,
  suggestions: [],
};

const rootReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {...state, id: action.payload};
    case 'SET_USER':
      return {...state, user: action.payload};
    case 'SET_SUGGESTION':
      return {...state, suggestions: action.payload};
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer,
});
