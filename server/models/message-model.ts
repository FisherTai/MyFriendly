import mongoose, { Model, Schema, model } from "mongoose";

/**
 * Create an interface representing a document in MongoDB.
 */
 export interface IMessage {
  message: {text: string};
  users: Array<string>;
  sender: mongoose.Schema.Types.ObjectId;
}
/**
 * Put all user instance methods in this interface:
 */
interface IMessageMethods {
  isFromSelf(): boolean;
}

/**
 * Create a new Model type that knows about IUserMethods...
 */
 type MessageModel = Model<IMessage,{}, IMessageMethods>;

/**
 * Create a Schema corresponding to the document interface, and the schema that knows about Methods.
 */
const messageSchema = new Schema<IMessage, MessageModel,IMessageMethods>(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.method("isFromSelf", function isFromSelf() {
  return this.USER_AVATAR !== "";
});

module.exports = model<IMessage, MessageModel>("MESSAGE", messageSchema);
