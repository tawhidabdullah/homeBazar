import * as types from "./types";

export const login = (customerData) => ({
    type: types.LOGIN,
    payload: customerData
});

export const logout = () => ({
    type: types.LOGOUT,
});



export const initializeSession = () => ({
    type: types.INITIALIZE,
});

export const setRedirectAfterLogin = () => ({
    type: types.SET_REDIRECT_AFTER_LOGIN,
});
