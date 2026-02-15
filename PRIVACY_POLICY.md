# Privacy Policy - Doom Scroll Blocker

**Last Updated:** [Current Date]

## Overview

Doom Scroll Blocker ("the Extension") is committed to protecting your privacy. This extension operates entirely within your browser and does not collect, store, or transmit any personal data.

## Data Collection

**We DO NOT collect:**
- Browsing history
- Page content you view
- Scroll behavior or patterns
- Personal information
- Any data that could identify you

**What stays local in YOUR browser:**
- Your settings (threshold, chaos mode, keywords)
- Interrupt statistics (how many times you've been redirected)
- Redirect history (last 50 URLs you were sent to, stored locally)

All data is stored using Chrome's local storage API (`chrome.storage.local`) and never leaves your device.

## Permissions Explained

The Extension requests the following permissions:

### Storage
**Why:** To save your settings and statistics locally in your browser
**Data stored:** Settings, interrupt count, redirect history
**Access:** Only this extension can read this data

### Tabs
**Why:** To redirect your current tab when doom-scrolling is detected
**Data accessed:** Current tab URL (only to check if you're on Twitter/Instagram/TikTok)
**What we do:** Change the URL to a random redirect link
**What we don't do:** Read page content, track your tabs, or monitor your browsing

### Notifications
**Why:** To show a message when you're redirected (e.g., "✨ Let's look at something wholesome instead")
**Data used:** Just the tier level (1-4) and redirect title
**Not tracked:** No data is sent anywhere

### Host Permissions (twitter.com, instagram.com, tiktok.com)
**Why:** To inject the scroll detection script on these specific sites
**Data accessed:** Scroll events only (how fast and how long you scroll)
**What we analyze:** Whether your scrolling pattern indicates doom-scrolling
**What we don't access:** Posts, comments, messages, photos, videos, or any page content

## Third-Party Services

**None.** This extension does not use any third-party services, analytics, or tracking tools.

**No external requests:** The extension does not make any network requests. All redirect links are stored locally within the extension.

## Data Sharing

**We do not share, sell, or transmit any data because we don't collect any data.**

## User Control

You have full control over this extension:

- **View settings:** Click the extension icon → Settings
- **Delete all data:** Click extension icon → Reset Stats, or uninstall the extension
- **Disable temporarily:** Click extension icon → Toggle "Protection Active" off
- **Remove completely:** Uninstall from chrome://extensions/

Uninstalling the extension permanently deletes all locally stored data.

## Children's Privacy

This extension does not knowingly collect data from anyone, including children under 13. Since we don't collect any data at all, there are no special considerations needed.

## Changes to Privacy Policy

If we update this policy, we will:
1. Update the "Last Updated" date at the top
2. Notify users via the extension update notes
3. Post the updated policy at [Your Website/GitHub]

Major changes will require user consent before taking effect.

## Contact

If you have questions about this privacy policy:
- Email: [Your Email]
- GitHub: [Your GitHub Repo]
- Chrome Web Store: [Leave a review/question]

## Your Rights

Under GDPR and similar privacy laws, you have the right to:
- **Access:** See what data we have (which is nothing)
- **Deletion:** Delete your data (uninstall the extension)
- **Portability:** Export your data (not applicable as data is already local)
- **Correction:** Modify your data (change settings anytime)

Since all data is local, you already have complete control.

## Technical Details

### Data Storage Location
All data is stored in: `chrome.storage.local`

This is Chrome's encrypted local storage, accessible only by this extension on your device.

### Data Retention
- Settings: Until you change them or uninstall
- Statistics: Until you reset them or uninstall
- Redirect history: Last 50 redirects only (rolling window)

### Security
- No data transmission = no data breach risk
- Chrome's built-in extension sandboxing protects your data
- Only you can access your extension data

## Compliance

This extension complies with:
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **Chrome Web Store Developer Program Policies**

## Transparency

**This extension is open source.** You can review the code to verify our privacy claims:
[Link to your GitHub repository]

**Key files to review:**
- `content/detector.js` - What data we track (scroll events only)
- `background/service-worker.js` - What we do with that data (calculate tier, select redirect)
- `manifest.json` - What permissions we request and why

## Summary

**In plain English:**
- Your privacy is respected
- We don't collect any data
- Everything happens locally in your browser
- You control all your data
- Uninstall anytime to delete everything

If you have any concerns, please contact us or review the source code.

---

**Last Updated:** [Current Date]
**Version:** 1.0.0
**Contact:** [Your Email]