// Service Worker - handles redirect logic and tier escalation

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DOOM_SCROLL_DETECTED') {
    handleInterrupt(sender.tab.id, message);
  }
});

async function handleInterrupt(tabId, data) {
  console.log('[Service Worker] Interrupt triggered:', data);
  
  try {
    // Get user state
    const state = await chrome.storage.local.get([
      'enabled',
      'interruptCount',
      'sessionInterrupts',
      'lastInterruptTime',
      'escalationLevel',
      'history',
      'chaosMode',
      'chaosIntensity'
    ]);

    if (state.enabled === false) {
      console.log('[Service Worker] Protection disabled; skipping interrupt');
      return;
    }
    
    // Calculate which tier to use
    const tier = calculateTier(state);
    
    console.log('[Service Worker] Using tier:', tier);
    
    // Load redirect pool for this tier
    const redirects = await loadRedirectPool(tier);
    
    if (!redirects || redirects.length === 0) {
      console.error('[Service Worker] No redirects found for tier', tier);
      return;
    }
    
    // Select a URL (avoid recent duplicates)
    const recentUrls = (state.history || []).slice(-10);
    const availableLinks = redirects.filter(link => !recentUrls.includes(link.url));
    
    // If all links were recent, just use the full pool
    const pool = availableLinks.length > 0 ? availableLinks : redirects;
    const selected = selectWeightedRandom(pool);
    
    // Update state
    const now = Date.now();
    await chrome.storage.local.set({
      interruptCount: (state.interruptCount || 0) + 1,
      sessionInterrupts: (state.sessionInterrupts || 0) + 1,
      lastInterruptTime: now,
      escalationLevel: tier,
      history: [...(state.history || []), selected.url].slice(-50) // Keep last 50
    });
    
    // Reset session counter daily
    resetSessionCounterDaily();
    
    // Show notification
    const tierMessage = getTierMessage(tier);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/assets/icons/icon128.png',
      title: tierMessage,
      message: selected.title || 'Taking you somewhere interesting...',
      silent: false
    });
    
    // Redirect the tab
    chrome.tabs.update(tabId, { url: selected.url });
    
  } catch (error) {
    console.error('[Service Worker] Error handling interrupt:', error);
  }
}

function calculateTier(state) {
  const chaosMode = state.chaosMode || false;
  
  // Chaos mode: random tier selection
  if (chaosMode) {
    return selectChaosTier(state.chaosIntensity || 0.5);
  }
  
  // Normal escalation logic
  const sessionInterrupts = state.sessionInterrupts || 0;
  const lastInterruptTime = state.lastInterruptTime || 0;
  const currentLevel = state.escalationLevel || 1;
  
  const hoursSinceLastInterrupt = 
    (Date.now() - lastInterruptTime) / (1000 * 60 * 60);
  
  // ESCALATION RULES:
  
  // Fresh start (12+ hours since last) - reset to Tier 1
  if (hoursSinceLastInterrupt > 12) {
    return 1;
  }
  
  // Multiple interrupts same day - escalate
  if (sessionInterrupts >= 4) {
    return 4; // Max tier
  }
  if (sessionInterrupts >= 3) {
    return 3;
  }
  if (sessionInterrupts >= 2) {
    return 2;
  }
  
  // Quick re-interrupt (< 2 hours) - escalate one level
  if (hoursSinceLastInterrupt < 2) {
    return Math.min(currentLevel + 1, 4);
  }
  
  // Default: maintain current level or start at 1
  return currentLevel || 1;
}

function selectChaosTier(intensity) {
  // Higher intensity = more likely to hit higher tiers
  // Intensity range: 0.0 to 1.0
  
  const weights = [
    0.3 - (intensity * 0.2),  // Tier 1: 30% at low intensity, 10% at high
    0.3,                       // Tier 2: constant 30%
    0.2 + (intensity * 0.2),  // Tier 3: 20% at low, 40% at high
    0.2 + (intensity * 0.3)   // Tier 4: 20% at low, 50% at high
  ];
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return i + 1;
    }
  }
  
  return 4; // Fallback
}

async function loadRedirectPool(tier) {
  try {
    const url = chrome.runtime.getURL(`data/tier${tier}.json`);
    const response = await fetch(url);
    const data = await response.json();
    return data.redirects;
  } catch (error) {
    console.error(`[Service Worker] Failed to load tier ${tier}:`, error);
    return [];
  }
}

function selectWeightedRandom(pool) {
  // Weight by quality score (1-10)
  const totalWeight = pool.reduce((sum, item) => sum + (item.quality || 5), 0);
  let random = Math.random() * totalWeight;
  
  for (const item of pool) {
    random -= (item.quality || 5);
    if (random <= 0) {
      return item;
    }
  }
  
  // Fallback to first item
  return pool[0];
}

function getTierMessage(tier) {
  const messages = {
    1: "✨ Let's look at something wholesome instead",
    2: "🌀 Time for something weird",
    3: "🎭 Entering the WEIRD zone",
    4: "🌍 Welcome to Global Oddities"
  };
  return messages[tier] || "Taking a break from doom-scrolling";
}

async function resetSessionCounterDaily() {
  const state = await chrome.storage.local.get(['lastResetDate', 'sessionInterrupts']);
  const today = new Date().toDateString();
  
  if (state.lastResetDate !== today) {
    await chrome.storage.local.set({
      sessionInterrupts: 0,
      lastResetDate: today
    });
  }
}

// Initialize: Reset session counter on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Service Worker] Extension installed/updated');
  resetSessionCounterDaily();
});

// Check daily for session reset
chrome.alarms.create('daily-reset', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-reset') {
    resetSessionCounterDaily();
  }
});
