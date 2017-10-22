import React, { Component, PropTypes } from 'react';
import PayloadStates from "../constants/PayloadStates";

class Location extends Component {

  onClick() {
    lore.actions.location.get();
  }

  render() {
    const { location } = this.props;

    return (
      <ul>
        <li>
          <div>
            <h3>What's this do?</h3>
            <p>
              Pressing the button below will invoke a custom action (<code>location.get</code>), that will attempt to
              ping a server and return your location. A custom reducer (<code>location</code>) will store this
              result, and the application will display it below the button.
            </p>
            <br/>
            <p>
              In order to retrieve the location via <code>lore.connect</code>, a custom mapping has been added to
              the <code>reducerActionMap</code> in the <code>connect</code> config, so that you request the location
              via <code>getState('location')</code>.
            </p>
            <br/>
            <p>
              Creating this mapping also means the location can automatically be fetched if it doesn't exist in
              the <code>location</code> reducer.
            </p>
          </div>
        </li>
        <li>
          <div>
            <button className="btn btn-primary" onClick={this.onClick}>
              Fetch Location
            </button>
          </div>
        </li>
        <li>
          {location.state === PayloadStates.FETCHING ? (
            <div>
              Fetching location...
            </div>
          ) : (
            <pre>
              {JSON.stringify(location.data, null, 2)}
            </pre>
          )}
        </li>
      </ul>
    );
  }

}

Location.PropTypes = {
  location: PropTypes.object.isRequired
};

export default lore.connect(function(getState, props) {
  return {
    location: getState('location')
  };
})(Location);
