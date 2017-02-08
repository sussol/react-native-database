# react-native-database

## Installation
`npm install --save react-native-database`

Requires that [Realm](http://realm.io) is also installed, if not:  
`npm install --save realm`

## Usage
This library contains two components, which can be used independently or in parallel
* [Database](#database) - Provides a simple wrapper around Realm, adding fine-grained notifications
* [Settings](#settings) - An interface for easily maintaining app settings in local storage, without any extra database clutter

### Database

Store any data your app needs in local storage, using essentially the same interface as standard [Realm](https://realm.io/docs/javascript/latest/), with custom fine grained notification functionality.
Requires a [realm format schema](https://realm.io/docs/javascript/latest/#models) to be passed in on construction.

#### Methods
Essentially the same as [Realm](https://realm.io/docs/javascript/latest/), but with different notifications.

* `write(callback)` - Creates a transaction, and executes a function within that transaction. Essential to wrap any code making persistent changes in a `write()`. See the [realm docs](https://realm.io/docs/javascript/latest/#writes)
* `addListener(callback)` - The `callback` passed in will be executed whenever there is a change to the database, and be passed the change type, record type, the old version of the record, and any additional parameters passed into the function that caused the change (see the `...listenerArgs` in `create`, `update` etc. below). `addListener` returns the id of the listener, which can be used to remove it once it is no longer needed (be sure to do this, or functions could be called with their context out of scope!)
* `removeListener(listenerId)` - Detaches the listener function identified by listenerId from the database
* `create(type, properties, ...listenerArgs)`, `update(type, properties, ...listenerArgs)`, `delete(type, object, ...listenerArgs)`, `deleteAll(...listenerArgs)` - All work exactly as in Realm, but also send out notifications of the change, i.e. call any change listeners that are attached to this Database. Any additional parameters beyond the standard Realm ones are passed through to the listening function in the same order
* `objects(type)` - Returns a ResultSet of all objects of the given type. The data is not immediately loaded into memory, meaning you don't have to worry about large queries exhausting memory capacity, or pagination to avoid it - Realm takes care of all of this, and loads the data as it is used. See the [realm docs](https://realm.io/docs/javascript/latest/#queries)

```
import { Database } from 'react-native-database';
class User {};
User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    username: { type: 'string', default: 'placeholderUsername' },
    lastLogin: { type: 'date', optional: true },
    firstName: { type: 'string', optional: true },
    lastName: { type: 'string', optional: true },
    email: { type: 'string', optional: true },
  },
};
const schema = { schema: [User], schemaVersion: 1 };
const database = new Database(schema);
```


### Settings

#### Methods
* set(key, value) - Takes in a (string) key that uniquely identifies the setting, and a (string) value to update against that key (or create if the setting with that key does not yet exist)
* get(key) - Returns the (string) value associated with the given key

#### Standalone
Settings can be constructed with no parameters, if you only intend to store settings in the local Realm database, and no extra data.

```
const settings = new Settings(database);
settings.set('CurrentUserName', 'Edwin');
console.log(`Hello ${settings.get('CurrentUserName')}!`); // Will print 'Hello Edwin!'
```

#### Using in conjunction with a database
If you need to store extra data, pass through a realm database including a 'Setting' table on construction. Note that this could be a react-native-database Database rather than a raw realm database.

```
import { Database, Settings } from 'react-native-database';
class Setting {};
Setting.schema = {
  name: 'Setting',
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: 'string',
  },
};
class User {};
User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    username: { type: 'string', default: 'placeholderUsername' },
    lastLogin: { type: 'date', optional: true },
    firstName: { type: 'string', optional: true },
    lastName: { type: 'string', optional: true },
    email: { type: 'string', optional: true },
  },
};
const schema = { schema: [Setting, User], schemaVersion: 1 };
const database = new Database(schema);
const settings = new Settings(database);
database.write(() => { database.create('User', { id: '54321', username: 'edmofro', firstName: 'Edwin' }) });
settings.set('CurrentUserId', '54321');
const currentUserId = settings.get('CurrentUserId')```
console.log(`Hello ${database.objects('User').filter(`id = ${settings.get('CurrentUserId')}`)[0].firstName}!`); // Will print 'Hello Edwin!'
```
