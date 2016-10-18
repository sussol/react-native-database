react-native-database

====Database====

Requires a realm format schema to be passed in on construction.
All methods supported by the database are documented inline, check src/Database.js
```import { Database } from 'react-native-database';
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
const database = new Database(schema);```


====Settings====

Requires a realm database including a 'Setting' table to be passed in on construction.
Note that this could be a react-native-database Database rather than a raw realm database.
Methods supported by a settings object are 'set', and 'get', each of which take a
key as the first parameter, and string as either the second parameter or return, respectively.

```import { Database, Settings } from 'react-native-database';
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
settings.set('CurrentUserId', '54321');
const currentUserId = settings.get('CurrentUserId')```
