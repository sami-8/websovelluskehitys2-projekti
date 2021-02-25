const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

exports.seed = function (knex) {
  return knex('pastes').del()
    .then(() => {
      const pastes = [
        {
          title: 'paste1',
          content: 'content 1',
          unlisted: false,
        },
        {
          title: 'paste2',
          content: 'content 2',
          unlisted: false,
        },
        {
          title: 'paste3',
          content: 'content 3',
          unlisted: false,
          delpassword: bcrypt.hashSync('paste3', 10),
        },
      ];

      return knex('pastes').insert(
        pastes.map((p) => ({ ...p, id: nanoid(10) })),
      );
    });
};
