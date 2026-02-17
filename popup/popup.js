// Popup script - handles UI interactions

let keywords = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Load current state
  await loadState();
  await loadSettings();
  
  // Set up event listeners
  document.getElementById('enableToggle').addEventListener('change', handleToggle);
  document.getElementById('resetBtn').addEventListener('click', handleReset);
  document.getElementById('optionsBtn').addEventListener('click', openSettings);
  
  // Settings panel listeners
  document.getElementById('closeSettings').addEventListener('click', closeSettings);
  
  // Add click handler for main toggle card
  document.getElementById('mainToggle').addEventListener('click', (e) => {
    // Don't toggle if clicking on the slider or its label
    if (e.target.closest('.toggle-switch')) {
      return;
    }
    const toggle = document.getElementById('enableToggle');
    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event('change'));
  });

  setupHeroHoverAnimation();
  
  setupSettingsListeners();
});

function setupHeroHoverAnimation() {
  const heroCard = document.getElementById('heroCard');
  const heroDefault = document.querySelector('.hero-default');
  if (!heroCard || !heroDefault) {
    return;
  }

  const HOVER_DELAY_MS = 1000;
  const MESSAGE_SHOW_DELAY_MS = 220;
  const HERO_SHIFT_MS = 2000;

  let hoverTimeout = null;
  let messageShowTimeout = null;
  let animationFrame = null;

  function stopHorizontalAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    heroDefault.style.willChange = '';
  }

  function getCurrentTranslateX() {
    const transform = window.getComputedStyle(heroDefault).transform;
    if (!transform || transform === 'none') {
      return 0;
    }
    try {
      return new DOMMatrixReadOnly(transform).m41;
    } catch (_error) {
      return 0;
    }
  }

  function getCenterOffset() {
    const cardWidth = heroCard.getBoundingClientRect().width;
    const textWidth = heroDefault.getBoundingClientRect().width;
    return (cardWidth - textWidth) / .5;
  }

  function animateHorizontalTo(targetX, duration) {
    const startX = getCurrentTranslateX();
    if (Math.abs(targetX - startX) < 0.5) {
      heroDefault.style.transform = `translate3d(${Math.round(targetX)}px, 0, 0)`;
      return;
    }

    stopHorizontalAnimation();
    heroDefault.style.willChange = 'transform';

    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentX = startX + ((targetX - startX) * easeProgress);

      heroDefault.style.transform = `translate3d(${Math.round(currentX)}px, 0, 0)`;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        stopHorizontalAnimation();
      }
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function clearPendingTimers() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    if (messageShowTimeout) {
      clearTimeout(messageShowTimeout);
      messageShowTimeout = null;
    }
  }

  function fullyResetHero() {
    clearPendingTimers();
    stopHorizontalAnimation();
    heroCard.classList.remove('is-message-visible');
    heroCard.classList.remove('is-hovered');
    heroDefault.style.transform = 'translate3d(0, 0, 0)';
  }

  heroCard.addEventListener('mouseenter', () => {
    clearPendingTimers();
    hoverTimeout = setTimeout(() => {
      startHorizontalAnimation();
    }, HOVER_DELAY_MS);
  });

  heroCard.addEventListener('mouseleave', () => {
    clearPendingTimers();
    heroCard.classList.remove('is-message-visible');
    heroCard.classList.remove('is-hovered');
    animateHorizontalTo(0, HERO_SHIFT_MS);
  });

  function startHorizontalAnimation() {
    heroCard.classList.add('is-hovered');
    messageShowTimeout = setTimeout(() => {
      heroCard.classList.add('is-message-visible');
      messageShowTimeout = null;
    }, MESSAGE_SHOW_DELAY_MS);
    animateHorizontalTo(getCenterOffset(), HERO_SHIFT_MS);
  }

  // Safety reset for fast popup close / blur edge cases
  window.addEventListener('blur', fullyResetHero);
}

async function loadState() {
  const state = await chrome.storage.local.get([
    'enabled',
    'sessionInterrupts',
    'interruptCount',
    'escalationLevel'
  ]);
  
  // Update toggle
  const toggle = document.getElementById('enableToggle');
  const enabled = state.enabled !== false; // Default to enabled
  toggle.checked = enabled;
  
  // Update status indicator
  updateStatusIndicator(enabled);
  
  // Update stats
  document.getElementById('sessionInterrupts').textContent = state.sessionInterrupts || 0;
  document.getElementById('totalInterrupts').textContent = state.interruptCount || 0;
  
  // Update current tier
  const tier = state.escalationLevel || 1;
  const tierNames = {
    1: 'Wholesome',
    2: 'Weird',
    3: 'WEIRD Weird',
    4: 'Global Oddities'
  };
  document.getElementById('currentTier').textContent = tierNames[tier];
}

function updateStatusIndicator(enabled) {
  const indicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const mainToggle = document.getElementById('mainToggle');
  const toggleLabel = document.querySelector('.toggle-label');
  
  if (enabled) {
    indicator.classList.remove('inactive');
    mainToggle.classList.remove('inactive');
    mainToggle.classList.add('active');
    statusText.textContent = 'ACTIVE';
    toggleLabel.textContent = 'Protection Mode';
  } else {
    indicator.classList.add('inactive');
    mainToggle.classList.add('inactive');
    mainToggle.classList.remove('active');
    statusText.textContent = 'INACTIVE';
    toggleLabel.textContent = 'Standing By';
  }
}

async function handleToggle(event) {
  const enabled = event.target.checked;
  await chrome.storage.local.set({ enabled });
  
  // Update status indicator
  updateStatusIndicator(enabled);
  
  console.log('Protection', enabled ? 'enabled' : 'disabled');
}

async function handleReset() {
  if (confirm('Reset today\'s stats? This will only reset today\'s saved count.')) {
    await chrome.storage.local.set({
      sessionInterrupts: 0,
      escalationLevel: 1
    });
    
    await loadState();
  }
}

function openSettings() {
  document.getElementById('settingsPanel').classList.add('active');
}

function closeSettings() {
  document.getElementById('settingsPanel').classList.remove('active');
}

async function loadSettings() {
  const settings = await chrome.storage.local.get([
    'threshold',
    'chaosMode',
    'chaosIntensity',
    'keywordTriggers'
  ]);
  
  // Load threshold
  const threshold = settings.threshold || 45;
  document.getElementById('thresholdSlider').value = threshold;
  document.getElementById('thresholdValue').textContent = threshold;
  
  // Load chaos mode
  const chaosMode = settings.chaosMode || false;
  document.getElementById('chaosModeToggle').checked = chaosMode;
  
  // Load chaos intensity
  const chaosIntensity = settings.chaosIntensity !== undefined ? settings.chaosIntensity : 0.5;
  const intensityPercent = Math.round(chaosIntensity * 100);
  document.getElementById('chaosIntensitySlider').value = intensityPercent;
  document.getElementById('chaosIntensityValue').textContent = intensityPercent;
  
  // Load keywords
  keywords = settings.keywordTriggers || [];
  renderKeywords();
}

function setupSettingsListeners() {
  // Threshold slider
  const thresholdSlider = document.getElementById('thresholdSlider');
  thresholdSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('thresholdValue').textContent = value;
  });
  thresholdSlider.addEventListener('change', async (e) => {
    await chrome.storage.local.set({ threshold: parseInt(e.target.value, 10) });
    showSaveNotice();
  });
  
  // Chaos mode toggle
  document.getElementById('chaosModeToggle').addEventListener('change', async (e) => {
    await chrome.storage.local.set({ chaosMode: e.target.checked });
    showSaveNotice();
  });
  
  // Chaos intensity slider
  const chaosSlider = document.getElementById('chaosIntensitySlider');
  chaosSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('chaosIntensityValue').textContent = value;
  });
  chaosSlider.addEventListener('change', async (e) => {
    const intensity = parseInt(e.target.value, 10) / 100;
    await chrome.storage.local.set({ chaosIntensity: intensity });
    showSaveNotice();
  });
  
  // Keyword input
  document.getElementById('addKeywordBtn').addEventListener('click', addKeyword);
  document.getElementById('keywordInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  });
  
  // Reset buttons
  document.getElementById('resetStatsBtn').addEventListener('click', resetStats);
  document.getElementById('resetAllBtn').addEventListener('click', resetAll);
}

async function addKeyword() {
  const input = document.getElementById('keywordInput');
  const keyword = input.value.trim().toLowerCase();
  
  if (!keyword) {
    return;
  }
  
  if (keywords.includes(keyword)) {
    alert('This keyword is already in the list');
    return;
  }
  
  keywords.push(keyword);
  await chrome.storage.local.set({ keywordTriggers: keywords });
  
  input.value = '';
  renderKeywords();
  showSaveNotice();
}

async function removeKeyword(keyword) {
  keywords = keywords.filter(k => k !== keyword);
  await chrome.storage.local.set({ keywordTriggers: keywords });
  renderKeywords();
  showSaveNotice();
}

function renderKeywords() {
  const container = document.getElementById('keywordList');
  container.replaceChildren();
  
  if (keywords.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-keywords';
    empty.textContent = 'No keywords added yet';
    container.appendChild(empty);
    return;
  }

  keywords.forEach((keyword) => {
    const tag = document.createElement('div');
    tag.className = 'keyword-tag';

    const label = document.createElement('span');
    label.textContent = keyword;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'keyword-remove';
    removeButton.setAttribute('aria-label', `Remove keyword: ${keyword}`);
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => removeKeyword(keyword));

    tag.appendChild(label);
    tag.appendChild(removeButton);
    container.appendChild(tag);
  });
}

async function resetStats() {
  if (!confirm('Reset all statistics? Your settings will be preserved.')) {
    return;
  }
  
  await chrome.storage.local.set({
    sessionInterrupts: 0,
    interruptCount: 0,
    escalationLevel: 1,
    history: []
  });
  
  await loadState(); // Refresh the display
  alert('Statistics reset successfully');
}

async function resetAll() {
  if (!confirm('Reset ALL settings and statistics? This cannot be undone.')) {
    return;
  }
  
  await chrome.storage.local.clear();
  
  // Reload the popup to show defaults
  window.location.reload();
}

function showSaveNotice() {
  const notice = document.getElementById('saveNotice');
  notice.classList.add('show');
  
  setTimeout(() => {
    notice.classList.remove('show');
  }, 2000);
}
