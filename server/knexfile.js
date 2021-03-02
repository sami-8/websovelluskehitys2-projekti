module.exports = {
  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: ':memory:',
    migrations: {
      tableName: 'migrations',
      directory: 'src/database/migrations',
    },
    seeds: {
      directory: 'src/database/seeds',
    },
  },
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './dev-sqlite.db',
    },
    migrations: {
      tableName: 'migrations',
      directory: 'src/database/migrations',
    },
    seeds: {
      directory: 'src/database/seeds',
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
    },
  },
};
