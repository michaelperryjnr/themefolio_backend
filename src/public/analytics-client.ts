interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

interface AnalyticsConfig {
  apiUrl: string;
  enableAutoPageView?: boolean;
  debug?: boolean;
  batchSize?: number;
  batchDelay?: number;
}

class Analytics {
  private readonly apiUrl: string;
  private readonly sessionId: string;
  private readonly debug: boolean;
  private readonly batchSize: number;
  private readonly batchDelay: number;
  private lastPageVisit: string | null = null;
  private eventQueue: Array<{ endpoint: string; data: unknown }> = [];
  private batchTimeout: number | null = null;

  constructor(config: AnalyticsConfig) {
    this.apiUrl = config.apiUrl;
    this.sessionId = this.generateSessionId();
    this.debug = config.debug || false;
    this.batchSize = config.batchSize || 10;
    this.batchDelay = config.batchDelay || 1000;

    this.initSession();

    if (config.enableAutoPageView) {
      this.trackPageVisit(window.location.pathname);
    }
  }

  private generateSessionId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  private logDebug(...args: unknown[]): void {
    if (this.debug) {
      console.log("[Analytics]", ...args);
    }
  }

  private async makeRequest<T>(endpoint: string, data: T): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      this.logDebug(`${endpoint} tracked successfully`, data);
    } catch (error) {
      this.logDebug(`Failed to track ${endpoint}:`, error);
      throw error;
    }
  }

  private queueEvent(endpoint: string, data: unknown): void {
    this.eventQueue.push({ endpoint, data });

    if (this.eventQueue.length >= this.batchSize) {
      this.processBatch();
    } else if (!this.batchTimeout) {
      this.batchTimeout = window.setTimeout(
        () => this.processBatch(),
        this.batchDelay
      );
    }
  }

  private async processBatch(): Promise<void> {
    if (this.batchTimeout) {
      window.clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (events.length === 0) return;

    try {
      await this.makeRequest(
        "event",
        events.map((e) => e.data)
      );
    } catch (error) {
      this.logDebug("Batch processing failed:", error);
      this.eventQueue.push(...events);
    }
  }

  private async initSession(): Promise<void> {
    const deviceInfo: DeviceInfo = {
      browser: this.getBrowserInfo(),
      os: this.getOsInfo(),
      device: this.getDeviceInfo(),
    };

    await this.makeRequest("session", {
      sessionId: this.sessionId,
      deviceInfo,
    });

    this.trackLogin();
  }

  public async trackLogin(): Promise<void> {
    const currentTime = new Date();
    const lastEventTime = localStorage.getItem("lastEventTime");

    const eventData = {
      sessionId: this.sessionId,
      eventType: "Login",
      eventData: {
        timestamp: currentTime.toISOString(),
        isReturningUser: Boolean(lastEventTime),
        previousVisit: lastEventTime || null,
      },
    };

    if (lastEventTime) {
      const lastDate = new Date(lastEventTime);
      const timeDiff = currentTime.getTime() - lastDate.getTime();

      this.queueEvent("event", {
        sessionId: this.sessionId,
        eventType: "Returning",
        eventData: {
          timestamp: currentTime.toISOString(),
          timeSinceLastVisit: this.formatTimeDifference(timeDiff),
          previousVisit: lastEventTime,
        },
      });
    }

    localStorage.setItem("lastEventTime", currentTime.toISOString());
    this.queueEvent("event", eventData);
  }

  private formatTimeDifference(timeDiff: number): string {
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days} days, ${hours % 24} hours, ${minutes % 60} minutes`;
  }

  public async trackLogout(): Promise<void> {
    const currentTime = new Date().toISOString();

    this.queueEvent("event", {
      sessionId: this.sessionId,
      eventType: "Logout",
      eventData: {
        timestamp: currentTime,
        lastPage: this.lastPageVisit,
      },
    });

    await this.processBatch();
  }

  public async trackPageVisit(path: string): Promise<void> {
    const currentTime = new Date().toISOString();
    const previousPage = this.lastPageVisit;
    this.lastPageVisit = path;

    await this.makeRequest("page-view", {
      path,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "Direct",
      timestamp: currentTime,
      ip: "User Protected",
    });

    this.queueEvent("event", {
      sessionId: this.sessionId,
      eventType: "Visited Page",
      eventData: {
        path,
        timestamp: currentTime,
        previousPage,
        referrer: document.referrer || "Direct",
      },
    });
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("MSIE") || ua.includes("Trident/7"))
      return "Internet Explorer";
    return "Unknown";
  }

  private getOsInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Macintosh")) return "MacOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS")) return "iOS";
    return "Unknown";
  }

  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Mobile")) return "Mobile";
    if (ua.includes("Tablet")) return "Tablet";
    return "Desktop";
  }
}

const analytics = new Analytics({
  apiUrl: "https://api.theniitettey.live/analytics",
  enableAutoPageView: true,
  debug: false,
  batchSize: 5,
  batchDelay: 1000,
});

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    analytics.trackLogout();
  }
});

let pageVisitTimeout: number;
function debouncedTrackPageVisit(path: string): void {
  window.clearTimeout(pageVisitTimeout);
  pageVisitTimeout = window.setTimeout(() => {
    analytics.trackPageVisit(path);
  }, 300);
}

window.addEventListener("popstate", () => {
  debouncedTrackPageVisit(window.location.pathname);
});

window.addEventListener("hashchange", () => {
  debouncedTrackPageVisit(window.location.pathname);
});

window.addEventListener("click", (event) => {
  const link = (event.target as Element).closest("a");
  if (link instanceof HTMLAnchorElement) {
    debouncedTrackPageVisit(link.href);
  }
});
