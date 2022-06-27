export const host = "http://localhost:5000";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
/**Get all users except a certain Id */
export const getAllUsersExIdRoute = `${host}/api/auth/allUsersExceptId`; 

export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;

/**
 * POST: send invite
 * @param receiverId : string the receiver ID 
 * 
 * PATCH: change invite state
 * /:_id
 */
export const inviteRoute = `${host}/api/invite`;

export const getSelfSendedInvities = `${host}/api/invite/getInvitiesBySender`;
export const getSelfReceivedInvities = `${host}/api/invite/getInvitiesByReceiver`;