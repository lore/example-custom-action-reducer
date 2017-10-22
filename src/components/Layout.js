/**
 * This component is intended to reflect the high level structure of your application,
 * and render any components that are common across all views, such as the header or
 * top-level navigation. All other components should be rendered by route handlers.
 **/

import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';
import Location from './Location';

class Layout extends Component {

  render() {
    return (
      <div>
        <div className="header">
          <div className="container">
            <div className="title">
              <img className="logo" src={logo} />
              <h1>
                Example: Custom Action & Reducer
              </h1>
              <h3>
                Demonstrates how to mix a custom action and reducer into those provided by conventions.
              </h3>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="container">
            <Location />
          </div>
        </div>
      </div>
    );
  }

}

export default Layout;
