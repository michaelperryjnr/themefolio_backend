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
        throw new Error(`
            HTTP Error: ${response.statusText}`);
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

  private async trackPageView(
    path: string = window.location.pathname
  ): Promise<void> {
    await this.makeRequest("page-view", {
      path,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "Self search",
      ip: await this.getIpAddress(),
    });
  }

  public async trackEvent(
    eventType: string,
    eventData: Record<string, unknown> = {}
  ): Promise<void> {
    await this.makeRequest("event", {
      sessionId: this.sessionId,
      eventType,
      eventData,
    });
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
    return fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => data.ip)
      .catch(() => {
        this.logDebug("Failed to fetch IP address:");
        return "Unknown";
      });
  }
}

const analytics = new Analytics({
  apiUrl: "https://api.theniitettey.live/analytics",
  enableAutoPageView: true,
  debug: false,
});
