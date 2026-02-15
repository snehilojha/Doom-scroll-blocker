# 🌀 Doom Scroll Blocker - Chaotic Good Edition

A browser extension that interrupts doom-scrolling by redirecting you to progressively weirder corners of the internet.

## 🚀 Quick Start

### 1. Add Your Curated Links

You mentioned you have your links ready. Replace the example links in these files with your curated collection:

- `data/tier1.json` - Wholesome content (~150 links)
- `data/tier2.json` - Weird internet (~150 links)
- `data/tier3.json` - WEIRD weird content (~100 links)
- `data/tier4.json` - Global oddities & live cams (~100 links)

**Format for each link:**
```json
{
  "url": "https://example.com",
  "title": "Short description of the link",
  "quality": 8
}
```

Quality score (1-10) determines how often a link appears. Higher = more frequent.

### 2. Create Extension Icons

You need 3 icon sizes. Create them using any design tool:

- `assets/icons/icon16.png` - 16×16px
- `assets/icons/icon48.png` - 48×48px
- `assets/icons/icon128.png` - 128×128px

**Quick icon creation:**
- Use Canva or Figma
- Design: Purple/blue gradient background with a spiral emoji (🌀)
- Export as PNG at required sizes
- Or use a free icon generator: https://favicon.io/

**Placeholder icons (for testing):**
You can temporarily use any 16x16, 48x48, and 128x128 PNG files to test. The extension will work without fancy icons.

### 3. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `doom-scroll-blocker` folder
5. Extension should now appear in your toolbar!

### 4. Test It

1. Go to Twitter/X, Instagram, or TikTok
2. Start scrolling continuously for 45 seconds
3. You should get redirected to a random link from Tier 1
4. Keep testing - the tier will escalate with repeated use

## ⚙️ Configuration

### Default Settings

- **Trigger threshold:** 45 seconds of continuous scrolling
- **Chaos mode:** Disabled
- **Keyword triggers:** None

### Customizing Settings

Click the extension icon → "Settings" to adjust:

1. **Trigger Threshold (20-120 seconds)**
   - Lower = more aggressive protection
   - Higher = more lenient
   
2. **Chaos Mode**
   - Enables random tier selection
   - Chaos intensity: 0-100%
   
3. **Keyword Triggers**
   - Auto-redirect when specific words appear
   - Example: "breaking", "elon", "trump"
   - Case-insensitive

## 🎯 How It Works

### Detection Algorithm

The extension tracks:
- **Scroll velocity:** How fast you're scrolling
- **Continuous engagement:** Time spent without pausing
- **Meaningful interactions:** Clicks on links/buttons

**It triggers when:**
- You've scrolled for [threshold] seconds
- You've made 20+ rapid scrolls (< 300ms between scrolls)
- You haven't clicked on links (not reading, just scrolling)

**It won't trigger when:**
- You're reading and clicking links
- You pause scrolling for 5+ seconds
- You're on a non-social-media site

### Tier Escalation

**Tier 1 - Wholesome** ✨
- First interrupt of the day
- 12+ hours since last interrupt

**Tier 2 - Weird** 🌀
- 2nd interrupt of the day
- Or quick re-interrupt (< 2 hours)

**Tier 3 - WEIRD Weird** 🎭
- 3rd interrupt of the day
- Persistent doom-scrolling

**Tier 4 - Global Oddities** 🌍
- 4+ interrupts in one day
- Maximum weirdness level

### Chaos Mode

When enabled:
- Ignores normal escalation rules
- Randomly selects any tier
- Higher intensity = more frequent triggers
- Use with caution!

## 📁 Project Structure

```
doom-scroll-blocker/
├── manifest.json              # Extension configuration
├── background/
│   └── service-worker.js      # Redirect logic & tier calculation
├── content/
│   └── detector.js            # Doom-scroll detection
├── popup/
│   ├── popup.html             # Quick stats UI
│   └── popup.js
├── options/
│   ├── options.html           # Full settings page
│   └── options.js
├── data/
│   ├── tier1.json             # Wholesome links
│   ├── tier2.json             # Weird links
│   ├── tier3.json             # WEIRD weird links
│   └── tier4.json             # Global oddities
└── assets/
    └── icons/                 # Extension icons
```

## 🔧 Development

### Testing Locally

1. Make changes to any file
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension card
4. Test on a social media site

### Debugging

**Content Script Issues:**
1. Open DevTools on the social media page
2. Check Console for `[Doom Scroll Blocker]` messages
3. Verify scroll events are being tracked

**Service Worker Issues:**
1. Go to `chrome://extensions/`
2. Click "service worker" under your extension
3. Check Console for redirect logic messages

**Common Issues:**

**Not detecting scrolls?**
- Check if extension is enabled (click icon in toolbar)
- Verify you're on Twitter/Instagram/TikTok
- Try lowering threshold in settings

**Redirects not working?**
- Check data/*.json files are valid JSON
- Verify URLs are complete (include https://)
- Check service worker console for errors

**Wrong tier activating?**
- Check escalation logic in service-worker.js
- Reset stats: Click extension icon → Reset Stats

## 📊 Privacy

**This extension is 100% local:**
- ✅ All detection runs in your browser
- ✅ No data sent to any server
- ✅ No analytics or tracking
- ✅ Links are stored locally in the extension

**Permissions explained:**
- `storage` - Save your settings and stats locally
- `tabs` - Redirect tabs when doom-scrolling detected
- `notifications` - Show tier messages
- Host permissions - Inject detection script on social media sites

## 🚢 Publishing to Chrome Web Store

When ready to publish:

1. Create a developer account ($5 one-time fee)
2. Prepare assets:
   - 5 screenshots (1280x800)
   - Promotional images
   - Privacy policy
3. Submit at https://chrome.google.com/webstore/devconsole
4. Review takes 1-7 days

**Tips for approval:**
- Clear, honest description
- No misleading features
- Privacy policy included
- Permissions justified

## 🎨 Customization Ideas

### Adding New Sites

Edit `manifest.json` to add content scripts for other sites:

```json
{
  "matches": ["*://reddit.com/*"],
  "js": ["content/detector.js"]
}
```

Then add site config in `content/detector.js`:

```javascript
'reddit.com': {
  name: 'Reddit',
  minScrolls: 30,
  defaultThreshold: 50
}
```

### Custom Redirect Pools

You can create themed redirect lists by duplicating tier files:

```
data/
├── tier1.json          # Default wholesome
├── tier1-nature.json   # Nature-only wholesome
├── tier1-art.json      # Art-focused wholesome
```

Then modify service-worker.js to load different pools based on user preference.

## 📈 Metrics to Track (Optional)

If you want to add basic tracking later:

- Total interrupts (already tracked)
- Average tier reached
- Most common redirect time of day
- Keyword trigger frequency

All can be stored locally in `chrome.storage.local`.

## 🤝 Contributing

Since this is your product:

1. Add more curated links
2. Fine-tune detection thresholds per site
3. Add new sites (Reddit, LinkedIn, etc.)
4. Create themed redirect packs
5. Improve UI design

## 📄 License

You own this. Add your preferred license when publishing.

## 🐛 Known Issues

**Refresh required after settings change:**
- Currently, you need to refresh the social media page after changing threshold/keywords
- Future: Add message passing to update config in real-time

**No mobile support:**
- Chrome extensions don't work on mobile Chrome
- Possible solution: Build as separate mobile app using Digital Wellbeing API

## 🎯 Next Steps

1. ✅ Add your curated links to data/*.json files
2. ✅ Create icon files (or use placeholders)
3. ✅ Load extension in Chrome
4. ✅ Test on Twitter/Instagram/TikTok
5. ✅ Customize settings
6. ✅ Get feedback from friends
7. ✅ Polish and publish!

---

**Questions?** Check the console logs in DevTools - they'll tell you what's happening.

**Ready to ship?** You have a working MVP. The code is production-ready. Just add your links and test!