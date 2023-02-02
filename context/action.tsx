export const LoginStart = (authState) => ({
  type: 'LOGIN_START',
});

export const LoginSuccess = (auth: string) => ({
  type: 'LOGIN_SUCCESS',
  payload: auth,
});

export const LoginFailure = () => ({
  type: 'LOGIN_FAILURE',
});

export const Logout = () => ({
  type: 'LOGOUT',
});
