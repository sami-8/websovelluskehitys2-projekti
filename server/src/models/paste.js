const { Model } = require('objection');

class Paste extends Model {
  static get tableName() {
    return 'pastes';
  }

  static get idColumn() {
    return 'id';
  }

  static async count() {
    return (await this.query().count())[0]['count(*)'];
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.unlisted;
    delete json.delpassword;
    return json;
  }
}

module.exports = Paste;
