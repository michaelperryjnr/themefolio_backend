import { Router, Response, Request } from "express";
import { EventModel, PageViewModel, SessionModel } from "../models";
import authMiddleware from "../middlewares/authMiddleware";
import { DeviceInfo, AnalyticsData, PageView, Session } from "../interfaces";
// import { auth } from "../controllers";

const analyticsRouter = Router();
interface PageViewRequest {
  path: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
  ip: string;
}

interface SessionRequest {
  sessionId: string;
  deviceInfo: DeviceInfo;
}

interface EventRequest {
  sessionId: string;
  eventType: string;
  eventData: Record<string, unknown>;
}

interface ErrorResponse {
  error: string;
}

const errorHandler = (error: Error, res: Response<ErrorResponse>) => {
  console.error(error);
  res.status(500).json({ error: error.message });
};

analyticsRouter.post(
  "/page-view",
  async (req: Request<{}, {}, PageViewRequest>, res: Response) => {
    try {
      const { path, userAgent, referrer, sessionId, ip } = req.body;
      const pageView = new PageViewModel({
        path,
        userAgent,
        referrer,
        sessionId,
        ip,
      });

      await pageView.save();
      await SessionModel.updateOne(
        { sessionId },
        { $addToSet: { pages: path } }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error as Error, res);
    }
  }
);

analyticsRouter.post(
  "/session",
  async (req: Request<{}, {}, SessionRequest>, res: Response) => {
    try {
      const { sessionId, deviceInfo } = req.body;
      const session = new SessionModel({
        sessionId,
        deviceInfo,
      });

      await session.save();
      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error as Error, res);
    }
  }
);

analyticsRouter.post(
  "/event",
  async (req: Request<{}, {}, EventRequest>, res: Response) => {
    try {
      const { sessionId, eventType, eventData } = req.body;

      const event = new EventModel({
        sessionId,
        eventType,
        eventData,
      });

      await event.save();
      res.status(200).json({ success: true });
    } catch (error) {
      errorHandler(error as Error, res);
    }
  }
);

interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

analyticsRouter.get(
  "/data",
  authMiddleware,
  async (
    req: Request<{}, {}, {}, DateRangeQuery>,
    res: Response
  ): Promise<any> => {
    try {
      const { startDate, endDate } = req.query;
      const query: { timestamp?: { $gte: Date; $lte: Date } } = {};

      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      let analytics;

      const pageViews = await PageViewModel.find(query);
      const sessions = await SessionModel.find(query);
      const events = await EventModel.find(query);

      if (!pageViews.length && !sessions.length && !events.length) {
        const allPageViews = await PageViewModel.find();
        const allSessions = await SessionModel.find();
        const allEvents = await EventModel.find();

        analytics = {
          popularPages: aggregatePopularPages(allPageViews),
          averageSessionDuration: calculateAverageSessionDuration(allSessions),
          totalEvents: allEvents.length,
        };
      } else {
        analytics = {
          popularPages: aggregatePopularPages(pageViews),
          averageSessionDuration: calculateAverageSessionDuration(sessions),
          totalEvents: events.length,
        };
      }
      res.status(200).json(analytics);
    } catch (error) {
      errorHandler(error as Error, res);
    }
  }
);

function aggregatePopularPages(pageViews: PageView[]): [string, number][] {
  const pages: Record<string, number> = {};
  pageViews.forEach((view) => {
    pages[view.path] = (pages[view.path] || 0) + 1;
  });
  return Object.entries(pages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
}

function calculateAverageSessionDuration(sessions: Session[]): number {
  const durationsMs = sessions
    .filter(
      (session): session is Session & { endTime: Date } => !!session.endTime
    )
    .map((session) => session.endTime.getTime() - session.startTime.getTime());

  return durationsMs.length
    ? durationsMs.reduce((a, b) => a + b, 0) / durationsMs.length
    : 0;
}

export default analyticsRouter;
