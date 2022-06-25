import { Model, Schema, model, Types } from "mongoose";

/**
 * 好友邀請的表
 * FORM : 發送邀請的會員ID
 * TO : 接收對象的會員ID
 * STATE: 1:同意 2:不同意 3:待處理
 */

interface Invitation {
  SENDER: Types.ObjectId;
  RECEIVER: Types.ObjectId;
  STATE: number;
}

interface InvitationMethods {
  isApprove(): boolean;
  isDisapprove(): boolean;
  isUnhandled(): boolean;
}

type InvitationModel = Model<Invitation, {}, InvitationMethods>;

const invitationSchema = new Schema<Invitation, InvitationModel, InvitationMethods>(
  {
    SENDER: {
      type: Schema.Types.ObjectId,
      ref: "USER",
    },
    RECEIVER: {
      type: Schema.Types.ObjectId,
      ref: "USER",
    },
    STATE: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

invitationSchema.method("isApprove", function isApprove() {
  return this.STATE == 1;
});

invitationSchema.method("isDisapprove", function isDisapprove() {
  return this.STATE == 2;
});

invitationSchema.method("isUnhandled", function isUnhandled() {
  return this.STATE == 3;
});

export default model<Invitation, InvitationModel>("INVITE", invitationSchema);
