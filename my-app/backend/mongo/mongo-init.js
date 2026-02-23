db.createUser({
  user: 'library_user',
  pwd: 'library_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'library',
    },
  ],
});

db.createCollection('authors');
db.createCollection('books');
db.createCollection('users');
