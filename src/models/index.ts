import { Schema, model } from "mongoose";
import { Session, PageView, AnalyticsEvent, User } from "../interfaces";

const PageViewSchema = new Schema<PageView>({
  path: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  referrer: { type: String, required: true },
  sessionId: { type: String, required: true },
});

const SessionSchema = new Schema<Session>({
  sessionId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  pages: [String],
  deviceInfo: {
    browser: { type: String, required: true },
    os: { type: String, required: true },
    device: { type: String, required: true },
  },
});

const EventSchema = new Schema<AnalyticsEvent>({
  sessionId: { type: String, required: true },
  eventType: { type: String, required: true },
  eventData: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

export const PageViewModel = model<PageView>("PageView", PageViewSchema);
export const SessionModel = model<Session>("Session", SessionSchema);
export const EventModel = model<AnalyticsEvent>("Event", EventSchema);
export const UserModel = model<User>("User", UserSchema);
