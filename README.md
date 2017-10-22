# example-custom-action-reducer

A [Lore](http://www.lorejs.org) example to demonstrate how to add a custom action and reducer, and create a mapping
between them so their behavior can be orchestrated via `lore.connect`.

See the commit history for the steps to reproduce the example from a new lore project (e.g. `lore new app-name --es6`). The commits were intentionally created to be read.

## Screenshot

![example-custom-action-reducer](https://user-images.githubusercontent.com/2637399/31866661-c92da022-b737-11e7-9243-dc779b3317e7.png)

## What does the custom action do?
The custom action (`location.get`, located in `src/actions/location/get.js`) makes a network request to `https://freegeoip.net/json/`, which will return an estimate of the user's location (city/state/country).

The response for that network request looks like this:

```json
{
  "ip": "4.15.14.179",
  "country_code": "US",
  "country_name": "United States",
  "region_code": "AZ",
  "region_name": "Arizona",
  "city": "Phoenix",
  "zip_code": "85004",
  "time_zone": "America/Phoenix",
  "latitude": 33.4499,
  "longitude": -112.0712,
  "metro_code": 753
}
```

## What does the "location" model do?
This action uses the `location` model to make that request. Because the payload doesn't have an `id` property, the `idAttribute` in the `location` model has been changed to `ip`, so that there will be a unique id for the request.

The `url` attribute of the model has also been modified to be `https://freegeoip.net/json/`, which will override any URL config set in `config/connections.js` (because models compose the final URL for the network request).


## What does the custom reducer do?
The custom reducer (`location`, located in `src/reducers/location/index.js`) behaves in a "singleton" style, meaning the reducer will only store a single piece of data. Whenever you press the button to fetch the location, the result will override whatever was previously stored in this reducer.

It's also important to point out that the name of this reducer (index.js) _completely eliminates any location-related reducers created by conventions_. Normally, once you create a `location` model, you have three reducers available (`byId`, `byCid` and `find`), and the folder structure for those reducers looks like this:

```
- reducers
  - location
      -index.js
      -byId.js
      -byCid.js
      -find.js
```

You can also see proof of this by entering `lore.store.getState().location` in the developer console *BEFORE* adding your custom reducer. In the console, you'll see this:

```
{
  byId: {...},
  byCid: {...},
  find: {...}
}
```

By naming our reducer `index.js`, we effectively said "we're going to take complete control of ALL reducers for the `location` model". You can see proof of this by entering `lore.store.getState().location` in the developer console *AFTER* adding your custom reducer. In the console, you'll see something like this:

```
{
  id: "4.15.14.179",
  state: "RESOLVED",
  data: {
    "ip": "4.15.14.179",
    "country_code": "US",
    "country_name": "United States",
    "region_code": "AZ",
    "region_name": "Arizona",
    "city": "Phoenix",
    "zip_code": "85004",
    "time_zone": "America/Phoenix",
    "latitude": 33.4499,
    "longitude": -112.0712,
    "metro_code": 753
  }
}
```

> If you name your reducer anything *other* than `index.js` (such as `geoLocation`), then you'll be *EXTENDING* the default  reducers, and will now have 4 for `location` (byId, byCid, find and geoLocation).

## How do we make our custom action/reducer usable via lore.connect?
The `getState` function in `lore.connect` takes a key (`location` for this example) and then checks to see if data for that key exists in the reducer store. If it does, it returns it. It it doesn't, it invokes the action responsible for retrieving it.

For this example, we want that key to be `location`, the reducer to be `location`, and the action to be `location.get`.

To set that up, so we can call `getState('location')`, we need to open up `config/connect.js` and add that mapping to the `reducerActionMap` like this:

```
...
  reducerActionMap: {
    'location': {
      action: 'location.get',
      reducer: 'location',
      blueprint: 'singleton'
    }
  }
...
```

The `singleton` value in the `blueprint` field tells the `getState` function that it should return whatever it finds in `lore.store.getState().location` (as opposed to the other blueprints like `byId` or `find` that will return data stored under a key inside the reducer).

## Once all this is setup, how do we call it?
Once you've set up your custom action, reducer and reducerActionMap, you can access it like any other model in your application, which you can see this example doing in `src/components/Location.js`.

```
class Location extends Component {

  onClick() {
    lore.actions.location.get();
  }
  
  ...
}

export default lore.connect(function(getState, props) {
  return {
    location: getState('location')
  }
})(Location)
```

This setup will cause the location to automatically be fetched when the `Location` component is mounted, and clicking the "Fetch Location" button will invoke the `location.get` action, which will cause the location to be re-fetched (which will be retrieved by the `getState('location')` method on the next render cycle.
