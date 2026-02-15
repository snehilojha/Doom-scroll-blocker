// Content script - injected into social media sites
// Detects doom-scrolling behavior and triggers interrupts

class DoomScrollDetector {
  constructor() {
    this.config = {
      enabled: true,
      threshold: 45, // seconds
      keywordTriggers: [],
      chaosMode: false,
      chaosIntensity: 0.5
    };
    
    this.state = {
      scrollCount: 0,
      startTime: Date.now(),
      lastScrollTime: Date.now(),
      rapidScrolls: 0,
      linkClicks: 0,
      lastInteractionTime: Date.now()
    };
    
    this.siteConfig = this.getSiteConfig();
    this.keywordIntervalId = null;
    this.chaosIntervalId = null;
    this.lastCountedScrollAt = 0;
    this.scrollDedupeMs = 90;
    this.isTriggering = false;
    this.init();
  }
  
  getSiteConfig() {
    const hostname = window.location.hostname;
    
    const configs = {
      'twitter.com': {
        name: 'Twitter',
        minScrolls: 25,
        defaultThreshold: 40
      },
      'x.com': {
        name: 'X',
        minScrolls: 25,
        defaultThreshold: 40
      },
      'instagram.com': {
        name: 'Instagram',
        minScrolls: 10,
        minTotalScrolls: 25,
        defaultThreshold: 30
      },
      'tiktok.com': {
        name: 'TikTok',
        minScrolls: 10,
        minTotalScrolls: 20,
        defaultThreshold: 25
      }
    };
    
    for (const domain in configs) {
      if (hostname.includes(domain)) {
        return configs[domain];
      }
    }
    
    return { name: 'Unknown', minScrolls: 20, defaultThreshold: 45 };
  }
  
  async init() {
    // Load user config from storage
    const stored = await chrome.storage.local.get([
      'enabled',
      'threshold',
      'keywordTriggers',
      'chaosMode',
      'chaosIntensity'
    ]);
    
    this.config = {
      enabled: stored.enabled !== false, // Default to enabled
      threshold: stored.threshold || this.siteConfig.defaultThreshold,
      keywordTriggers: stored.keywordTriggers || [],
      chaosMode: stored.chaosMode || false,
      chaosIntensity: stored.chaosIntensity || 0.5
    };

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') {
        return;
      }
      let refreshDynamicFeatures = false;

      if (changes.enabled) {
        this.config.enabled = changes.enabled.newValue !== false;
        if (!this.config.enabled) {
          this.resetState();
        }
        refreshDynamicFeatures = true;
      }
      if (changes.threshold) {
        this.config.threshold = changes.threshold.newValue;
      }
      if (changes.chaosMode) {
        this.config.chaosMode = !!changes.chaosMode.newValue;
        refreshDynamicFeatures = true;
      }
      if (changes.chaosIntensity) {
        this.config.chaosIntensity = changes.chaosIntensity.newValue;
      }
      if (changes.keywordTriggers) {
        this.config.keywordTriggers = changes.keywordTriggers.newValue || [];
        refreshDynamicFeatures = true;
      }
      if (refreshDynamicFeatures) {
        this.updateDynamicFeatures();
      }
    });
    
    if (!this.config.enabled) {
      console.log('[Doom Scroll Blocker] Disabled for this site');
    } else {
      console.log('[Doom Scroll Blocker] Initialized on', this.siteConfig.name);
    }

    // Attach event listeners. Some sites (especially Instagram) scroll nested
    // containers/reels, so track wheel and touchmove in addition to scroll.
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    document.addEventListener('scroll', this.onScroll.bind(this), { passive: true, capture: true });
    document.addEventListener('wheel', this.onWheel.bind(this), { passive: true, capture: true });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true, capture: true });
    document.addEventListener('click', this.onClick.bind(this), true);

    this.updateDynamicFeatures();
  }
  
  onScroll() {
    if (!this.config.enabled) {
      return;
    }
    this.recordScrollActivity(300);
  }

  onWheel(event) {
    if (!this.config.enabled) {
      return;
    }
    if (Math.abs(event.deltaY) < 8) {
      return;
    }
    this.recordScrollActivity(350);
  }

  onTouchMove() {
    if (!this.config.enabled) {
      return;
    }
    this.recordScrollActivity(450);
  }
  
  onClick(event) {
    if (!this.config.enabled) {
      return;
    }
    // Track meaningful clicks (links, buttons)
    if (event.target.tagName === 'A' || 
        event.target.closest('a') ||
        event.target.tagName === 'BUTTON') {
      this.state.linkClicks++;
      this.state.lastInteractionTime = Date.now();
    }
  }

  recordScrollActivity(rapidWindowMs) {
    const now = Date.now();
    if ((now - this.lastCountedScrollAt) < this.scrollDedupeMs) {
      return;
    }

    const delta = now - this.state.lastScrollTime;
    if (delta > 0 && delta < rapidWindowMs) {
      this.state.rapidScrolls++;
    }

    this.state.scrollCount++;
    this.state.lastScrollTime = now;
    this.state.lastInteractionTime = now;
    this.lastCountedScrollAt = now;
    this.checkTriggerConditions();
  }
  
  checkTriggerConditions() {
    if (!this.config.enabled) {
      return;
    }

    const now = Date.now();
    const elapsed = (now - this.state.startTime) / 1000;
    const idleTime = (now - this.state.lastInteractionTime) / 1000;
    
    // Don't trigger if user is idle (stopped scrolling)
    if (idleTime > 5) {
      return;
    }
    
    // TRIGGER CONDITIONS:
    // 1. Exceeded time threshold
    // 2. Enough rapid scrolls
    // 3. Not enough meaningful clicks (not reading content)
    const minTotalScrolls = this.siteConfig.minTotalScrolls || this.siteConfig.minScrolls * 2;
    const conditions = {
      timeExceeded: elapsed > this.config.threshold,
      rapidScrolling: this.state.rapidScrolls >= this.siteConfig.minScrolls,
      enoughScrolling: this.state.scrollCount >= minTotalScrolls,
      notReading: this.state.linkClicks < 3
    };
    
    if (conditions.timeExceeded && 
        (conditions.rapidScrolling || conditions.enoughScrolling) &&
        conditions.notReading) {
      
      console.log('[Doom Scroll Blocker] Trigger conditions met:', {
        elapsed: elapsed.toFixed(1) + 's',
        rapidScrolls: this.state.rapidScrolls,
        linkClicks: this.state.linkClicks
      });
      
      this.triggerInterrupt();
    }
  }
  
  checkKeywords() {
    if (!this.config.enabled) return;
    if (this.config.keywordTriggers.length === 0) return;
    
    const bodyText = (document.body?.innerText || '').toLowerCase();
    if (!bodyText) {
      return;
    }
    
    for (const keyword of this.config.keywordTriggers) {
      if (bodyText.includes(keyword.toLowerCase())) {
        console.log('[Doom Scroll Blocker] Keyword trigger:', keyword);
        this.triggerInterrupt();
        break;
      }
    }
  }

  startKeywordWatcher() {
    if (this.keywordIntervalId !== null) {
      return;
    }
    this.keywordIntervalId = setInterval(() => this.checkKeywords(), 3000);
  }

  stopKeywordWatcher() {
    if (this.keywordIntervalId === null) {
      return;
    }
    clearInterval(this.keywordIntervalId);
    this.keywordIntervalId = null;
  }
  
  startChaosMode() {
    if (this.chaosIntervalId !== null) {
      return;
    }
    // Random triggers based on intensity
    const checkInterval = 10000; // Check every 10 seconds
    
    this.chaosIntervalId = setInterval(() => {
      if (!this.config.enabled || !this.config.chaosMode) {
        return;
      }
      const shouldTrigger = Math.random() < (this.config.chaosIntensity / 10);
      
      if (shouldTrigger && this.state.scrollCount > 5) {
        console.log('[Doom Scroll Blocker] Chaos mode trigger!');
        this.triggerInterrupt();
      }
    }, checkInterval);
  }

  stopChaosMode() {
    if (this.chaosIntervalId === null) {
      return;
    }
    clearInterval(this.chaosIntervalId);
    this.chaosIntervalId = null;
  }

  updateDynamicFeatures() {
    if (!this.config.enabled) {
      this.stopKeywordWatcher();
      this.stopChaosMode();
      return;
    }

    if (this.config.keywordTriggers.length > 0) {
      this.startKeywordWatcher();
    } else {
      this.stopKeywordWatcher();
    }

    if (this.config.chaosMode) {
      this.startChaosMode();
    } else {
      this.stopChaosMode();
    }
  }
  
  async triggerInterrupt() {
    if (this.isTriggering) {
      return;
    }
    this.isTriggering = true;

    try {
      const { enabled } = await chrome.storage.local.get('enabled');
      if (enabled === false) {
        return;
      }

      // Send message to service worker to handle redirect
      chrome.runtime.sendMessage({
        type: 'DOOM_SCROLL_DETECTED',
        site: this.siteConfig.name,
        duration: (Date.now() - this.state.startTime) / 1000,
        scrollCount: this.state.scrollCount,
        rapidScrolls: this.state.rapidScrolls
      });
      
      this.resetState();
    } catch (error) {
      console.error('[Doom Scroll Blocker] Failed to trigger interrupt:', error);
    } finally {
      this.isTriggering = false;
    }
  }

  resetState() {
    this.state = {
      scrollCount: 0,
      startTime: Date.now(),
      lastScrollTime: Date.now(),
      rapidScrolls: 0,
      linkClicks: 0,
      lastInteractionTime: Date.now()
    };
  }
}

// Initialize detector when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DoomScrollDetector();
  });
} else {
  new DoomScrollDetector();
}
