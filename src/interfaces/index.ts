interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

interface Session {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pages: string[];
  deviceInfo: DeviceInfo;
}

interface PageView {
  path: string;
  timestamp: Date;
  userAgent: string;
  ip: string;
  referrer: string;
  sessionId: string;
}

interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: Date;
}

interface AnalyticsData {
  totalPageViews: number;
  totalSessions: number;
  totalEvents: number;
  popularPages: [string, number][];
  averageSessionDuration: number;
}

interface User {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
}

export { DeviceInfo, Session, PageView, AnalyticsEvent, AnalyticsData, User };
