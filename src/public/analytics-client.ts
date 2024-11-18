import { randomBytes } from "crypto";

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

interface AnalyticsConfig {
  apiUrl: string;
  enableAutoPageView?: boolean;
  debug?: boolean;
}

class Analytics {
  private readonly apiUrl: string;
  private readonly sessionId: string;
  private readonly debug: boolean;

  constructor(config: AnalyticsConfig) {
    this.apiUrl = config.apiUrl;
    this.sessionId = this.generateSessionId();
    this.debug = config.debug || false;

    this.initSession();

    if (config.enableAutoPageView) {
      this.trackPageView();
    }
  }

  private generateSessionId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (c: string) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Log debug messages if enabled
  private logDebug(...args: unknown[]): void {
    if (this.debug) {
      console.log("[Analytics]", ...args);
    }
  }

  private async makeRequest<T>(endpoint: string, data: T): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.statusText}`);
      }

      this.logDebug(`${endpoint} tracked successfully`);
    } catch (error) {
      this.logDebug(`Failed to track ${endpoint}:`, error);
      throw error;
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

    await this.trackLogin();

    await this.trackReturn();
  }

  public async trackLogin(): Promise<void> {
    const currentTime = new Date().toISOString();
    const lastEventTime = localStorage.getItem("lastEventTime");

    let timeDifference = "First visit";
    if (lastEventTime) {
      const lastEventDate = new Date(lastEventTime);
      const diffInMs = new Date().getTime() - lastEventDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      timeDifference = `${diffInDays} days, ${diffInHours % 24} hours, ${
        diffInMinutes % 60
      } minutes`;
    }

    localStorage.setItem("lastEventTime", currentTime);

    await this.makeRequest("event", {
      sessionId: this.sessionId,
      eventType: "Login",
      eventData: {
        timeDifference,
        isReturningUser: lastEventTime ? true : false,
      },
    });

    this.logDebug("Tracked login event.");
  }

  public async trackLogout(): Promise<void> {
    const currentTime = new Date().toISOString();
    const lastEventTime = localStorage.getItem("lastEventTime");

    let timeDifference = "First visit";
    if (lastEventTime) {
      const lastEventDate = new Date(lastEventTime);
      const diffInMs = new Date().getTime() - lastEventDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      timeDifference = `${diffInDays} days, ${diffInHours % 24} hours, ${
        diffInMinutes % 60
      } minutes`;
    }

    localStorage.setItem("lastEventTime", currentTime);

    await this.makeRequest("event", {
      sessionId: this.sessionId,
      eventType: "Logout",
      eventData: {
        timeDifference,
        isReturningUser: lastEventTime ? true : false,
      },
    });

    this.logDebug("Tracked logout event.");
  }

  public async trackPageVisit(path: string = "/unknown"): Promise<void> {
    try {
      const ip = await this.getIpAddress();
      await this.makeRequest("event", {
        sessionId: this.sessionId,
        eventType: "Visit Page",
        eventData: {
          path,
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
          referrer: document.referrer || "Direct",
          ip,
        },
      });

      this.logDebug("Tracked page visit event.");
    } catch (error) {
      this.logDebug("Error tracking page visit:", error);
    }
  }

  public async trackReturn(): Promise<void> {
    const lastEventTime = localStorage.getItem("lastEventTime");
    const currentTime = new Date().toISOString();

    let timeDifference = "First visit";
    if (lastEventTime) {
      const lastEventDate = new Date(lastEventTime);
      const diffInMs = new Date().getTime() - lastEventDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      timeDifference = `${diffInDays} days, ${diffInHours % 24} hours, ${
        diffInMinutes % 60
      } minutes`;
    }

    if (lastEventTime) {
      await this.makeRequest("event", {
        sessionId: this.sessionId,
        eventType: "Return",
        eventData: {
          timeDifference,
          isReturningUser: true,
        },
      });

      this.logDebug("Tracked return event.");
    }
  }

  private async trackPageView(
    path: string = typeof window !== "undefined"
      ? window.location.pathname
      : "/unknown"
  ): Promise<void> {
    try {
      const ip = await this.getIpAddress();
      await this.makeRequest("page-view", {
        path,
        sessionId: this.sessionId,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
        referrer: document.referrer || "Direct",
        ip,
      });
    } catch (error) {
      this.logDebug("Error tracking page view:", error);
    }
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    let browser = "Unknown";

    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("MSIE") || ua.includes("Trident/7"))
      browser = "Internet Explorer";

    return browser;
  }

  private getOsInfo(): string {
    const ua = navigator.userAgent;
    let os = "Unknown";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    return os;
  }

  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    let device = "Desktop";

    if (ua.includes("Mobile")) device = "Mobile";
    else if (ua.includes("Tablet")) device = "Tablet";

    return device;
  }

  private async getIpAddress(): Promise<string> {
    return `User-Protected-IP-x.x.x.x`;
  }
}

const analytics = new Analytics({
  apiUrl: "https://api.theniitettey.live/analytics",
  enableAutoPageView: true,
  debug: false,
});

window.addEventListener("beforeunload", async () => {
  await analytics.trackLogout();
});

window.addEventListener("load", async () => {
  await analytics.trackLogin();
});

window.addEventListener("popstate", async () => {
  await analytics.trackPageVisit(window.location.pathname);
});

window.addEventListener("hashchange", async () => {
  await analytics.trackPageVisit(window.location.pathname);
});

window.addEventListener("click", async (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    await analytics.trackPageVisit(event.target.href);
  }
});
