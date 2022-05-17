import { Model, Schema, model } from "mongoose";

/**
 * Create an interface representing a document in MongoDB.
 */
interface IUser {
  USER_NAME: string;
  USER_EMAIL: string;
  USER_PW: string;
  USER_SEX: number;
  USER_AVATAR?: string;
  USER_POINTS?: number;
  USER_REPORT?: number;
}
/**
 * Put all user instance methods in this interface:
 */
interface IUserMethods {
  isAvatarImageSet(): boolean;
  isMale(): boolean;
}

/**
 * Create a new Model type that knows about IUserMethods...
 */
type UserModel = Model<IUser, {}, IUserMethods>;

/**
 * Create a Schema corresponding to the document interface, and the schema that knows about IUserMethods.
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  USER_NAME: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  USER_EMAIL: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  USER_SEX: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  USER_PW: {
    type: String,
    required: true,
    min: 8,
  },
  USER_AVATAR: {
    type: String,
    default: "",
  },
  USER_POINTS: {
    type: Number,
    default: 0,
  },
  USER_REPORT: {
    type: Number,
    default: 0,
  },
});

userSchema.method("isAvatarImageSet", function isAvatarImageSet() {
  return this.USER_AVATAR === "";
});

userSchema.method("isMale", function isMale() {
  return this.USER_SEX === 1;
});

module.exports = model<IUser, UserModel>("USER", userSchema);
