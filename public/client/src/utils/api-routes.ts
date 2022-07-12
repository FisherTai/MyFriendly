export const host = "http://localhost:5000";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const getUserConcats = `${host}/api/auth/getUserConcats`;
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

export const getMySendInvite = `${host}/api/invite/getInvitiesBySender`;
export const getMyReceiveInvite = `${host}/api/invite/getInvitiesByReceiver`;

/**
 * PATCH: /:_id
 */
export const approveInvite = `${host}/api/invite/approve`;
export const rejectInvite = `${host}/api/invite/reject`;

export const getSelfSendedInvities = `${host}/api/invite/getInvitiesBySender`;
export const getSelfReceivedInvities = `${host}/api/invite/getInvitiesByReceiver`;