# Privacy Policy - Doom Scroll Blocker

**Last Updated:** February 15, 2026  
**Version:** 1.0.0

## Overview

Doom Scroll Blocker runs locally in your browser.  
The extension does not run a backend service and does not send analytics or personal data to a remote server.

## What the Extension Processes

On supported sites (X/Twitter, Instagram, TikTok), the extension processes:

- Scroll activity signals (for example: scroll count, rapid scroll patterns, elapsed scroll duration)
- Basic interaction signals (for example: meaningful clicks)
- Optional keyword matching against on-page text when you enable keyword triggers

This processing is used only to decide whether to interrupt doom-scrolling and redirect your current tab.

## Data Stored Locally

The extension uses `chrome.storage.local` to store:

- Preferences (enabled/disabled state, threshold, chaos mode, chaos intensity, keyword triggers)
- Usage stats (session interrupts, total interrupts, escalation level, last interrupt time)
- Recent redirect history (up to the last 50 redirect URLs)

This data stays on your device in browser extension storage.

## Network and Redirects

- The extension does not transmit your browsing data to a Doom Scroll Blocker server.
- When an interrupt is triggered, the extension navigates your active tab to a URL from the local curated lists (`data/tier*.json`).
- Visiting those destination websites is a normal browser navigation and is subject to each destination site's own privacy practices.

## Permissions

- `storage`: Save settings and local statistics.
- `tabs`: Redirect the active tab when an interrupt is triggered.
- `notifications`: Show interruption notifications.
- Host permissions (`twitter.com`, `x.com`, `instagram.com`, `tiktok.com`): Run detection logic on supported domains.

## Data Sharing

Doom Scroll Blocker does not sell or share your data with third parties.  
No telemetry or advertising SDKs are included.

## Your Controls

- Disable protection at any time from the popup.
- Reset statistics from popup/options.
- Reset all settings from options.
- Uninstall the extension to remove locally stored extension data.

## Policy Changes

If this policy changes, the "Last Updated" date will be revised in this file.
