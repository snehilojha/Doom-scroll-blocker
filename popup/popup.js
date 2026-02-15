// Popup script - handles UI interactions

document.addEventListener('DOMContentLoaded', async () => {
  // Load current state
  await loadState();
  
  // Set up event listeners
  document.getElementById('enableToggle').addEventListener('change', handleToggle);
  document.getElementById('resetBtn').addEventListener('click', handleReset);
  document.getElementById('optionsBtn').addEventListener('click', openOptions);
});

async function loadState() {
  const state = await chrome.storage.local.get([
    'enabled',
    'sessionInterrupts',
    'interruptCount',
    'escalationLevel'
  ]);
  
  // Update toggle
  const toggle = document.getElementById('enableToggle');
  toggle.checked = state.enabled !== false; // Default to enabled
  
  // Update stats
  document.getElementById('sessionInterrupts').textContent = state.sessionInterrupts || 0;
  document.getElementById('totalInterrupts').textContent = state.interruptCount || 0;
  
  // Update current tier
  const tier = state.escalationLevel || 1;
  const tierNames = {
    1: 'Wholesome ✨',
    2: 'Weird 🌀',
    3: 'WEIRD Weird 🎭',
    4: 'Global Oddities 🌍'
  };
  document.getElementById('currentTier').textContent = `Current tier: ${tierNames[tier]}`;
}

async function handleToggle(event) {
  const enabled = event.target.checked;
  await chrome.storage.local.set({ enabled });
  
  console.log('Protection', enabled ? 'enabled' : 'disabled');
}

async function handleReset() {
  if (confirm('Reset all stats? This cannot be undone.')) {
    await chrome.storage.local.set({
      sessionInterrupts: 0,
      interruptCount: 0,
      escalationLevel: 1,
      history: []
    });
    
    await loadState();
  }
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}