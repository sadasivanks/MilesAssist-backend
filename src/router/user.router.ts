// Route definitions for UserController.
// API prefix: /api/users

export const USER_ROUTES = {
  BASE: 'users',

  GET_USERS: {
    method: 'GET',
    path: '',
    handler: 'getUsers',
  },

  GET_USER_STATS: {
    method: 'GET',
    path: 'stats',
    handler: 'getUserStats',
  },

  GET_USER_BY_ID: {
    method: 'GET',
    path: ':id',
    handler: 'getUserById',
  },

  CREATE_USER: {
    method: 'POST',
    path: '',
    handler: 'createUser',
  },

  UPDATE_USER: {
    method: 'PATCH',
    path: ':id',
    handler: 'updateUser',
  },

  DELETE_USER: {
    method: 'DELETE',
    path: ':id',
    handler: 'deleteUser',
  },
} as const;
