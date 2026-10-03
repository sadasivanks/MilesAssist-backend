// Route definitions for AuthController.
// Each entry shows HTTP method, API path and the controller method it calls.

export const AUTH_ROUTES = {
  LOGIN_ADMIN: {
    method: "POST",
    path: "login",
    handler: "loginAdmin",
  },
  GET_MY_PROFILE: {
    method: "GET",
    path: "me",
    handler: "getMyProfile",
  },
} as const;
