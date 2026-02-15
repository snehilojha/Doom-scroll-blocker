// Popup script - handles UI interactions

document.addEventListener('DOMContentLoaded', async () => {
  // Load current state
  await loadState();
  
  // Set up event listeners
  document.getElementById('enableToggle').addEventListener('change', handleToggle);
  document.getElementById('resetBtn').addEventListener('click', handleReset);
  document.getElementById('optionsBtn').addEventListener('click', openOptions);
  
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
  
  if (enabled) {
    indicator.classList.remove('inactive');
    mainToggle.classList.remove('inactive');
    mainToggle.classList.add('active');
    statusText.textContent = 'ACTIVE';
  } else {
    indicator.classList.add('inactive');
    mainToggle.classList.add('inactive');
    mainToggle.classList.remove('active');
    statusText.textContent = 'INACTIVE';
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

function openOptions() {
  chrome.runtime.openOptionsPage();
}
