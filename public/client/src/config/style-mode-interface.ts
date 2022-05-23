export interface IColor {
  // [flag: string]: string;
  main_color: string;
  from_color: string;
  text_color: string;
  secondary_color:string;
  btn_text_color:string;
  analogous_colour:string;
  chat_color:string;
  chat_input_color:string;
  chat_room_color:string;
  chat_sended_color:string;
  chat_recieved_color:string;
  chat_container_btn_color:string;
  scroll_bar_color:string;
  emoji_picker_color:string;
  emoji_picker_border_color:string;
  contacts_color:string;
  contacts_selected_color:string;
  contacts_myinfo:string;
  border_color:string;
  contacts_text_color:string;
}

export interface IStyleMode {
  daylight: IColor;
  night: IColor;
}

export interface componentProps {
  readonly style: IColor;
}
