// Options page script

let keywords = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

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

function setupEventListeners() {
  // Threshold slider
  const thresholdSlider = document.getElementById('thresholdSlider');
  thresholdSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('thresholdValue').textContent = value;
  });
  thresholdSlider.addEventListener('change', async (e) => {
    await chrome.storage.local.set({ threshold: parseInt(e.target.value) });
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
    const intensity = parseInt(e.target.value) / 100;
    await chrome.storage.local.set({ chaosIntensity: intensity });
    showSaveNotice();
  });
  
  // Keyword input
  document.getElementById('addKeywordBtn').addEventListener('click', addKeyword);
  document.getElementById('keywordInput').addEventListener('keypress', (e) => {
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
  
  if (keywords.length === 0) {
    container.innerHTML = '<p style="color: #9ca3af; font-size: 13px;">No keywords added yet</p>';
    return;
  }
  
  container.innerHTML = keywords.map(keyword => `
    <div class="keyword-tag">
      <span>${keyword}</span>
      <span class="keyword-remove" onclick="removeKeywordFromUI('${keyword}')">×</span>
    </div>
  `).join('');
}

// Global function for onclick handler
window.removeKeywordFromUI = function(keyword) {
  removeKeyword(keyword);
};

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
  
  alert('Statistics reset successfully');
}

async function resetAll() {
  if (!confirm('Reset ALL settings and statistics? This cannot be undone.')) {
    return;
  }
  
  await chrome.storage.local.clear();
  
  // Reload the page to show defaults
  window.location.reload();
}

function showSaveNotice() {
  const notice = document.getElementById('saveNotice');
  notice.classList.add('show');
  
  setTimeout(() => {
    notice.classList.remove('show');
  }, 2000);
}