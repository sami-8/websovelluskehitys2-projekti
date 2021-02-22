const { nanoid } = require('nanoid');

exports.seed = function (knex) {
  return knex('pastes').del()
    .then(() => {
      const pastes = [
        {
          title: 'title 1',
          content: 'content 1',
          unlisted: false,
        },
        {
          title: 'title 2',
          content: 'content 2',
          unlisted: false,
        },
        {
          title: 'title 3',
          content: 'content 3',
          unlisted: false,
        },
      ];

      return knex('pastes').insert(
        pastes.map((p) => ({ ...p, id: nanoid(10) })),
      );
    });
};
