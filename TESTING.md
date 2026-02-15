# 🧪 Testing & Deployment Guide

## Pre-Flight Checklist

Before loading the extension, make sure:

- [ ] All 4 tier JSON files have your curated links
- [ ] Each tier has at least 10 links (more is better)
- [ ] All URLs start with `https://` or `http://`
- [ ] Icons created (or using placeholders)
- [ ] JSON files are valid (run `python3 link_helper.py validate data/tier1.json`)

## Testing Guide

### Phase 1: Basic Functionality (10 minutes)

**1. Load Extension**
```
1. Open chrome://extensions/
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select doom-scroll-blocker folder
5. Verify extension appears
```

**2. Test Detection**
```
1. Go to twitter.com or x.com
2. Start scrolling continuously
3. Don't click any links
4. After 45 seconds, you should be redirected
5. Check where you landed - should be a Tier 1 link
```

**3. Test Popup**
```
1. Click extension icon in toolbar
2. Verify stats show 1 interrupt
3. Toggle "Protection Active" off
4. Try scrolling on Twitter - should NOT redirect
5. Toggle back on
```

**4. Test Settings**
```
1. Click extension icon → Settings
2. Lower threshold to 20 seconds
3. Refresh Twitter page
4. Scroll for 20 seconds - should redirect faster
5. Set back to 45 seconds
```

### Phase 2: Tier Escalation (20 minutes)

**Test normal escalation:**

1. Clear stats (extension popup → Reset Stats)
2. Go to Twitter and doom-scroll until redirected
3. Note the tier (should be Tier 1 - Wholesome)
4. Go back to Twitter immediately
5. Scroll again - should redirect to Tier 2
6. Repeat - Tier 3, then Tier 4

**Expected pattern:**
```
First interrupt:  Tier 1 ✨
Second interrupt: Tier 2 🌀 (if < 2 hours after first)
Third interrupt:  Tier 3 🎭
Fourth interrupt: Tier 4 🌍
```

### Phase 3: Advanced Features (15 minutes)

**1. Keyword Triggers**
```
1. Go to Settings
2. Add keyword: "breaking"
3. Go to Twitter
4. Search for "breaking news"
5. Scroll the results - should redirect within ~3 seconds
```

**2. Chaos Mode**
```
1. Go to Settings
2. Enable Chaos Mode
3. Set intensity to 80%
4. Go to Twitter
5. Scroll - should get random interrupts at unpredictable times
6. Tiers should be random, not escalating
```

**3. Test All Sites**
```
- Twitter/X: Should work
- Instagram: Should work
- TikTok: Should work
- Reddit: Should NOT work (not in manifest)
- YouTube: Should NOT work (not in manifest)
```

### Phase 4: Edge Cases (10 minutes)

**1. False Positive Test**
```
Goal: Make sure it doesn't trigger when you're actually reading

1. Go to Twitter
2. Open a thread with many replies
3. Click into the thread
4. Scroll slowly, clicking on replies to read them
5. Should NOT redirect (you're engaging, not doom-scrolling)
```

**2. Pause Test**
```
1. Go to Twitter
2. Scroll for 30 seconds
3. STOP scrolling completely for 10 seconds
4. Resume scrolling
5. Should NOT redirect immediately (timer resets on long pause)
```

**3. Multi-Tab Test**
```
1. Open Twitter in 3 tabs
2. Scroll in Tab 1 until redirect
3. Switch to Tab 2
4. Start scrolling immediately
5. Should escalate to Tier 2 (state is shared across tabs)
```

## Debugging Common Issues

### Issue: Not detecting scrolls

**Check:**
```javascript
// Open DevTools on Twitter
// Console should show:
[Doom Scroll Blocker] Initialized on Twitter
```

**If not appearing:**
1. Verify extension is enabled (icon has color, not greyed out)
2. Check you're on twitter.com/x.com (not mobile.twitter.com)
3. Reload extension: chrome://extensions/ → Refresh icon
4. Hard refresh Twitter: Ctrl+Shift+R

### Issue: Redirects to blank page or 404

**Check:**
```
1. Open data/tier1.json
2. Verify all URLs are complete
3. Test a URL directly in browser
4. Run: python3 link_helper.py validate data/tier1.json
```

### Issue: Settings not saving

**Check:**
```javascript
// In extension service worker console:
chrome.storage.local.get(null, console.log)

// Should show your settings
```

### Issue: Extension crashes after update

**Fix:**
```
1. Go to chrome://extensions/
2. Remove the extension
3. Close all Chrome windows
4. Reopen Chrome
5. Re-load extension
```

## Performance Testing

**Monitor resource usage:**

```
1. Open Chrome Task Manager (Shift+Esc)
2. Find "Extension: Doom Scroll Blocker"
3. Check CPU and Memory usage
4. Should be < 50MB RAM
5. CPU should spike during scrolling, then drop to ~0%
```

**If using too much memory:**
- Reduce history length in service-worker.js (currently 50 redirects)
- Clear stats more frequently

## Pre-Launch Checklist

Before publishing:

- [ ] Tested on all 3 platforms (Twitter, Instagram, TikTok)
- [ ] All 4 tiers have diverse, working links
- [ ] No broken links (run validator on all tier files)
- [ ] Icons look good at all sizes
- [ ] Settings persist after browser restart
- [ ] No console errors in normal usage
- [ ] Tested chaos mode and keyword triggers
- [ ] Privacy-preserving (no external requests)
- [ ] README is complete
- [ ] Version number updated in manifest.json

## Publishing to Chrome Web Store

**Required assets:**

1. **Screenshots (5 required)**
   - 1280x800px or 640x400px
   - Show: popup, settings page, redirect in action
   - Use CMD+Shift+4 on Mac, Snipping Tool on Windows

2. **Store listing images**
   - Small tile: 440x280px
   - Large tile: 920x680px (optional)
   - Marquee: 1400x560px (optional)

3. **Description (max 132 chars for short)**
   ```
   Short: Interrupts doom-scrolling by redirecting you to weird & wonderful corners of the internet
   
   Long: [Write 2-3 paragraphs about features, how it works, why it's different]
   ```

4. **Privacy Policy**
   - Must be hosted somewhere public
   - Can use GitHub Pages
   - Template included in privacy_policy.md

**Submission process:**

1. Create developer account: https://chrome.google.com/webstore/devconsole
2. Pay $5 one-time fee
3. Create new item
4. Upload doom-scroll-blocker.zip (create via: `zip -r doom-scroll-blocker.zip doom-scroll-blocker/`)
5. Fill in store listing
6. Submit for review

**Review timeline:**
- Initial review: 1-3 days
- If flagged: up to 7 days
- Updates: usually same day

## Post-Launch Monitoring

**Week 1:**
- Check reviews daily
- Monitor crash reports
- Fix critical bugs immediately

**Week 2-4:**
- Collect user feedback
- Note most-requested features
- Track which tiers users reach most

**Metrics to watch:**
- Install count
- Daily active users
- Uninstall rate (should be < 20%)
- Average rating (target: 4.5+)

## Version History Template

Track changes for update submissions:

```
## v1.0.0 - Initial Release
- Basic doom-scroll detection
- 4-tier escalation system
- Chaos mode
- Keyword triggers

## v1.0.1 - Bug Fixes
- Fixed: Detection too aggressive on Instagram
- Fixed: Tier 4 links returning 404
- Improved: Threshold customization range

## v1.1.0 - New Features
- Added: Reddit support
- Added: Safe mode (Tier 1 only)
- Improved: Better detection on TikTok
```

## Support Plan

**Common user questions:**

Q: "Why did it redirect me while I was reading?"
A: Adjust threshold higher (60-90s) for less aggressive protection

Q: "Can I add my own links?"
A: Not in v1.0, but coming soon (requires backend)

Q: "Does this track my browsing?"
A: No. Everything is local. Check Privacy Policy.

Q: "Can I disable it for specific sites?"
A: Yes, toggle off in popup, or remove host permission in chrome://extensions/

## Success Criteria

**MVP is successful if:**
- ✅ Works reliably on all 3 platforms
- ✅ Users find the redirects genuinely interesting
- ✅ < 20% uninstall rate in first month
- ✅ No critical bugs reported
- ✅ Average rating 4.0+

**Ready to iterate if:**
- People want more customization
- Specific sites need better detection
- Users request new redirect categories
- Community wants to submit links

---

**You're ready to ship when all Phase 1-4 tests pass!**