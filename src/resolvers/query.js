module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find();
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id);
  },
  // Добавляем в существующий объект module.exports следующее:
  user: async (parent, { username }, { models }) => {
    // Находим пользователя по имени
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    // Находим всех пользователей
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    // Находим пользователя по текущему пользовательскому контексту
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // Жестко кодируем лимит в 10 элементов
    const limit = 10;
    let hasNextPage = false;
    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    let notes = await models.Note.find(cursorQuery)
      .sort({_id: -1})
      .limit(limit + 1)

    if(notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1)
    }

    const newCursor = notes[notes.length - 1]._id

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    }
  }
};
