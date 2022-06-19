export const host = "http://localhost:5000";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
/**Get all users except a certain Id */
export const getAllUsersExIdRoute = `${host}/api/auth/allUsersExceptId`; 

export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
