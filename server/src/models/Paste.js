const { Model } = require('objection');

class Paste extends Model {
  static get tableName() {
    return 'pastes';
  }

  static get idColumn() {
    return 'id';
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.unlisted;
    return json;
  }
}

module.exports = Paste;
