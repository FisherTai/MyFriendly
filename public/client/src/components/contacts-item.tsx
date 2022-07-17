import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";

import { FaRegUserCircle } from "react-icons/fa";

import { RootState } from "../redux/store";
import { IUser, Invite } from "../config/interface";
import { setCurrentChat } from "../redux/reducers/current-chat-slice";
import { removeContactsUser } from "../redux/reducers/chat-contacts-list-slice";
import { Flags } from "../utils/untils";
import { approveInvite, rejectInvite } from "../utils/api-routes";

type Props = {
  contact: IUser;
  index: number;
  currentSelected: number | undefined;
  setCurrentSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const ContactsItem = (props: Props) => {
  const { contact, index, currentSelected, setCurrentSelected } = props;
  const currentTab = useSelector((state: RootState) => state.chatContactsTab.value);

  const dispatch = useDispatch();

  const changeCurrentChat = (index: number, contact: IUser) => {
    if(currentTab === Flags.TAB_REVICED){
      return;
    }
    setCurrentSelected(index);
    dispatch(setCurrentChat(contact));
  };

  const onApproval = async (inviteId: string) => {
    const { data } = await axios.patch(`${approveInvite}/${inviteId}`,{}, { withCredentials: true });
    if(data.code === 200){
      dispatch(removeContactsUser(contact))
    }
  };

  const onReject = async (inviteId: string) => {
    const { data } = await axios.patch(`${rejectInvite}/${inviteId}`,{}, { withCredentials: true });
    if(data.code === 200){
      dispatch(removeContactsUser(contact))
    }
  };

  return (
    <div className={`contact ${index === currentSelected ? "selected" : ""}`} onClick={() => changeCurrentChat(index, contact)}>
      <div className="avatar">
        {contact.USER_AVATAR ? <img src={`data:image/svg+xml;base64,${contact.USER_AVATAR}`} alt="" /> : <FaRegUserCircle size={50} color="white" />}
      </div>
      <div className="username">
        <h3>{contact.USER_NAME}</h3>
      </div>
      {currentTab === Flags.TAB_REVICED && (
        <div className="invite">
          <button onClick={() => onApproval(contact.invite_id)}>接受</button>
          <button className="reject" onClick={() => onReject(contact.invite_id)}>拒絕</button>
        </div>
      )}
    </div>
  );
};

export default ContactsItem;
