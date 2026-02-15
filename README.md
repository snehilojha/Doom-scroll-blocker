# Doom Scroll Blocker

Doom Scroll Blocker is a Chrome extension designed to reduce passive doom-scrolling on social platforms. It detects prolonged, low-engagement scrolling and redirects the tab to curated alternative content.

## What This Project Does

- Monitors scroll behavior on supported social media sites
- Distinguishes passive scrolling from active reading or interaction
- Triggers an interrupt when scrolling patterns match doom-scrolling behavior
- Redirects users to one of four curated content tiers
- Stores settings and usage data locally in the browser

## Supported Sites

- X (Twitter)
- Instagram
- TikTok

## How It Works

At runtime, the extension combines:

- Continuous scroll duration
- Scroll burst frequency
- Interaction signals (for example, meaningful clicks)

When thresholds are exceeded, the service worker selects a redirect target from the configured tier data files.

## Basic Usage

1. Ensure the extension is enabled.
2. Browse a supported site normally.
3. If passive scrolling continues past the configured threshold, a redirect is triggered.
4. Update behavior through the extension popup and options page.

## Privacy

This extension operates locally:

- No remote analytics
- No external data upload
- All settings and stats remain in browser storage

## Permissions

- `storage`: save preferences and usage counters
- `tabs`: redirect the active tab when triggered
- `notifications`: show interrupt/tier notices
- Host permissions: run detection logic on supported domains

## Repository Structure

```text
doom-scroll-blocker/
|- manifest.json
|- background/
|  `- service-worker.js
|- content/
|  `- detector.js
|- popup/
|  |- popup.html
|  `- popup.js
|- options/
|  |- options.html
|  `- options.js
|- data/
|  |- tier1.json
|  |- tier2.json
|  |- tier3.json
|  `- tier4.json
`- assets/
   `- icons/
```

