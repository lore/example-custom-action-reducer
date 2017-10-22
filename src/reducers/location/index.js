import { ActionTypes, PayloadStates } from 'lore-utils';
import _ from 'lodash';

const initialState = {
  state: PayloadStates.INITIAL_STATE
};

export default  function registration(state, action) {
  state = state || initialState;
  var nextState = _.assign({}, state);

  switch (action.type) {
    case ActionTypes.add('location'):
      return action.payload;

    case ActionTypes.update('location'):
      return action.payload;

    case ActionTypes.remove('location'):
      return action.payload;

    case ActionTypes.RESET_STORE:
      return initialState;

    default:
      return nextState
  }
};
