interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: Date;
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
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: number;

  constructor(config: AnalyticsConfig) {
    this.apiUrl = config.apiUrl;
    this.sessionId = this.generateSessionId();
    this.debug = config.debug || false;

    this.initSession();

    if (config.enableAutoPageView) {
      this.trackPageView();
    }

    this.listenForEvents();

    // Set up batch sending every 30 seconds
    this.flushInterval = window.setInterval(() => this.flushEvents(), 30000);
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
  }

  public async trackPageView(
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

  public trackEvent(
    eventType: string,
    eventData: Record<string, unknown> = {}
  ): void {
    const event: AnalyticsEvent = {
      sessionId: this.sessionId,
      eventType,
      eventData,
      timestamp: new Date(),
    };

    this.eventQueue.push(event);
    this.logDebug("Tracked event:", event);
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length > 0) {
      const eventsToSend = [...this.eventQueue];
      this.eventQueue = [];

      try {
        await this.makeRequest("event", { events: eventsToSend });
        this.logDebug("Flushed events:", eventsToSend);
      } catch (error) {
        this.logDebug("Failed to flush events, re-queuing:", error);
        this.eventQueue.push(...eventsToSend);
      }
    }
  }

  private listenForEvents(): void {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const eventData = {
        tagName: target.tagName,
        id: target.id || null,
        classList: Array.from(target.classList),
        x: event.clientX,
        y: event.clientY,
      };
      this.trackEvent("click", eventData);
    });

    document.addEventListener("keypress", (event) => {
      const eventData = {
        key: event.key,
        code: event.code,
      };
      this.trackEvent("keypress", eventData);
    });

    this.logDebug("Event listeners for clicks and keypresses attached.");
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
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      this.logDebug("Failed to fetch IP address:", error);
      return "0.0.0.0/self-searched";
    }
  }
}

// Example Usage
const analytics = new Analytics({
  apiUrl: "https://api.theniitettey.live/analytics",
  enableAutoPageView: true,
  debug: true,
});
