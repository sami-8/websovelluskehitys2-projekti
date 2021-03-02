const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

exports.seed = function (knex) {
  return knex('pastes').del()
    .then(() => {
      const pastes = [];

      for (let i = 1; i <= 50; i += 1) {
        const paste = {
          id: nanoid(10),
          title: `paste${i}`,
          content: `content${i}`,
          unlisted: false,
        };
        if (i % 10 === 0) {
          Object.assign(paste, {
            delpassword: bcrypt.hashSync(`paste${i}`, 10),
          });
        }
        pastes.push(paste);
      }

      return knex('pastes').insert(pastes);
    });
};
