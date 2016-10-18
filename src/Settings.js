/**
 * Maintains storage of application settings. Takes in a realm database in the
 * constructor, which should have a 'Setting' table in the schema as described
 * below.
 * {
 * 		name: 'Setting',
 *  	primaryKey: 'key',
 *  	properties: {
 *   		key: 'string',
 *      value: 'string'
 *    }
 * }
 */
export class Settings {
  constructor(database) {
    this.database = database;
  }

  set(key, value) {
    this.database.write(() => {
      this.database.update('Setting', {
        key: key,
        value: value.toString(),
      });
    });
  }

  get(key) {
    const results = this.database.objects('Setting').filtered('key == $0', key);
    if (results && results.length > 0) return results[0].value;
    return ''; // Return empty string if no setting with the given key
  }
}
