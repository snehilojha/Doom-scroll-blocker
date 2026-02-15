# ⚡ QUICK START - Get Running in 5 Minutes

## Step 1: Add Your Links (2 minutes)

You said you have your curated links ready. Here's how to add them:

### Option A: Replace the JSON files

Open each file and replace the example links with yours:

```bash
# Edit each tier file
data/tier1.json  # Add ~150 wholesome links
data/tier2.json  # Add ~150 weird links  
data/tier3.json  # Add ~100 WEIRD weird links
data/tier4.json  # Add ~100 global oddities links
```

**JSON format:**
```json
{
  "tier": 1,
  "name": "Wholesome",
  "description": "Calming, positive, uplifting content",
  "redirects": [
    {
      "url": "https://example.com",
      "title": "Example Site - Short description",
      "quality": 8
    }
  ]
}
```

### Option B: Use the helper script

```bash
# Add links one by one
python3 link_helper.py add data/tier1.json "https://example.com" "Title" 8

# Validate when done
python3 link_helper.py validate data/tier1.json
```

---

## Step 2: Load Extension (1 minute)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Toggle ON "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `doom-scroll-blocker` folder
6. Extension icon should appear in toolbar!

---

## Step 3: Test It (2 minutes)

1. Go to **twitter.com** or **x.com**
2. Start scrolling continuously (don't click anything)
3. After **45 seconds**, you'll be redirected!
4. Check where you landed - should be one of your Tier 1 links

**It works!** 🎉

---

## Customize Settings

Click the extension icon → **Settings** to adjust:

- **Trigger threshold:** 20-120 seconds (default: 45s)
- **Chaos mode:** Random interrupts
- **Keyword triggers:** Auto-redirect when words appear

---

## Common First-Time Issues

### "Extension won't load"
- Make sure all files are in the doom-scroll-blocker folder
- Check that manifest.json exists
- Look for errors in chrome://extensions/

### "Not detecting my scrolling"
- Verify you're on Twitter, Instagram, or TikTok
- Extension must be enabled (icon in color, not gray)
- Threshold might be too high - try lowering to 30s

### "Redirects to blank page"
- Check your JSON files have valid URLs
- All URLs must start with https:// or http://
- Run: `python3 link_helper.py validate data/tier1.json`

### "Settings not saving"
- Hard refresh the page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or reload extension: chrome://extensions/ → Click refresh icon

---

## What Happens Next?

**First redirect:** Tier 1 (Wholesome) ✨
**Keep doom-scrolling:** Escalates to Tier 2, 3, 4
**After 12 hours:** Resets to Tier 1

**Your stats:**
- Click extension icon to see interrupt count
- Track which tier you're at
- Reset stats anytime

---

## File Checklist

Make sure these files exist:

```
✅ manifest.json
✅ background/service-worker.js
✅ content/detector.js
✅ popup/popup.html
✅ popup/popup.js
✅ options/options.html
✅ options/options.js
✅ data/tier1.json (with your links)
✅ data/tier2.json (with your links)
✅ data/tier3.json (with your links)
✅ data/tier4.json (with your links)
✅ assets/icons/icon16.png
✅ assets/icons/icon48.png
✅ assets/icons/icon128.png
```

---

## You're Done! 🚀

**Extension is ready to use.**

Want to test more thoroughly? Check out `TESTING.md` for comprehensive test scenarios.

Ready to publish? See `TESTING.md` section on "Publishing to Chrome Web Store".

---

## Quick Tips

💡 **Lower threshold = more aggressive** (catches doom-scrolling faster)

💡 **Quality score 1-10** in JSON = how often a link appears (higher = more frequent)

💡 **Chaos mode** = random tiers, unpredictable (fun but chaotic!)

💡 **Keyword triggers** = instant redirect when words appear (e.g., "breaking")

💡 **Reset stats** = Click icon → Reset Stats (clears interrupt count)

---

## Next Steps

1. ✅ **Use it yourself** for a week
2. ✅ **Share with friends** to get feedback  
3. ✅ **Tune the links** - remove duds, add gems
4. ✅ **Adjust thresholds** per site if needed
5. ✅ **Publish to Chrome Web Store** when ready

**Need help?** Check the full README.md

**Found a bug?** Check the console logs (F12 → Console)

**Want to customize?** All code is commented and readable