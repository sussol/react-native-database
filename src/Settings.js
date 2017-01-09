import { Database } from './Database';

// The format of a Setting table, which is required in the dtabase for Settings to work
export const SettingSchema = {
  name: 'Setting',
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: 'string',
  },
};

/**
 * Maintains storage of application settings. Takes in a realm database in the
 * constructor, which should have a 'Setting' table in the schema as exported
 * above. If no database is passed in, one will be constructed with a Setting
 * table only.
 */
export class Settings {
  constructor(database) {
    if (database) this.database = database;
    else this.database = new Database({ schema: [SettingSchema], schemaVersion: 1 });
  }

  set(key, value) {
    this.database.write(() => {
      this.database.update('Setting', {
        key: key,
        value: value.toString(),
      });
    });
  }

  delete(key) {
    this.database.write(() => {
      const results = this.database.objects('Setting').filtered('key == $0', key);
      if (results && results.length > 0) {
        const setting = results[0];
        this.database.delete('Setting', setting);
      }
    });
  }

  get(key) {
    const results = this.database.objects('Setting').filtered('key == $0', key);
    if (results && results.length > 0) return results[0].value;
    return ''; // Return empty string if no setting with the given key
  }
}
