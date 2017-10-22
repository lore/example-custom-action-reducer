import _ from 'lodash';
import { ActionTypes, PayloadStates, payload } from 'lore-utils';
import axios from 'axios';

/*
 * Blueprint for Get method
 */
export default function get(modelId) {
  return function(dispatch) {
    var Model = lore.models.location;
    var model = new Model();

    axios.get('https://freegeoip.net/json/').then(function(response) {
      model.set(response.data);
      dispatch({
        type: ActionTypes.update('location'),
        payload: payload(model, PayloadStates.RESOLVED)
      });
    }).catch(function(response) {
      var error = response.data;

      if (response.status === 404) {
        dispatch({
          type: ActionTypes.update('location'),
          payload: _.merge(payload(model), {
            state: PayloadStates.NOT_FOUND,
            error: error
          })
        });
      } else {
        dispatch({
          type: ActionTypes.update('location'),
          payload: payload(model, PayloadStates.ERROR_FETCHING, error)
        });
      }
    });

    return dispatch({
      type: ActionTypes.add('location'),
      payload: payload(model, PayloadStates.FETCHING)
    });
  };
};
