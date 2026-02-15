# Doom Scroll Blocker

Doom Scroll Blocker is a Chrome extension that detects prolonged passive scrolling on selected social media platforms and redirects users to curated alternatives.

## Features

- Detects high-frequency, continuous scrolling patterns
- Avoids triggering during active reading and link interaction
- Supports progressive tier-based redirect behavior
- Optional chaos mode for randomized tier selection
- Optional keyword-based triggers
- Stores all settings and usage data locally

## Quick Start

### 1. Prepare Redirect Data

Update the curated link files in `data/`:

- `data/tier1.json` (wholesome content)
- `data/tier2.json` (weird content)
- `data/tier3.json` (more unusual content)
- `data/tier4.json` (global oddities)

Each entry should follow this format:

```json
{
  "url": "https://example.com",
  "title": "Short description",
  "quality": 8
}
```

`quality` is a weight from 1 to 10. Higher values increase selection frequency.

### 2. Add Icons

Place icon files in `assets/icons/`:

- `icon16.png`
- `icon48.png`
- `icon128.png`

### 3. Load in Chrome

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Select **Load unpacked**
4. Choose this project folder

### 4. Validate Behavior

1. Open a supported platform (X/Twitter, Instagram, or TikTok)
2. Scroll continuously for the configured threshold
3. Confirm redirect behavior and tier escalation

## Configuration

Default behavior:

- Trigger threshold: 45 seconds
- Chaos mode: disabled
- Keyword triggers: none

Configure from extension settings:

- Trigger threshold (20 to 120 seconds)
- Chaos mode and intensity
- Keyword trigger list

## Detection Model

The extension monitors:

- Scroll velocity
- Continuous engagement duration
- Interaction quality (for example, link clicks)

Trigger conditions:

- Scrolling duration exceeds threshold
- Rapid scroll count is high
- Low meaningful interaction suggests passive consumption

It does not trigger when:

- The user is actively interacting with content
- Scrolling pauses long enough to reset engagement state
- The page is outside supported target domains

## Tier Escalation

- Tier 1: first interrupt or long cooldown
- Tier 2: repeated use in a shorter window
- Tier 3: persistent repeated scrolling
- Tier 4: high-frequency repeat pattern

Chaos mode bypasses normal escalation and selects tiers randomly based on configured intensity.

## Project Structure

```text
doom-scroll-blocker/
|- manifest.json
|- background/
|  |- service-worker.js
|- content/
|  |- detector.js
|- popup/
|  |- popup.html
|  |- popup.js
|- options/
|  |- options.html
|  |- options.js
|- data/
|  |- tier1.json
|  |- tier2.json
|  |- tier3.json
|  |- tier4.json
`- assets/
   `- icons/
```

## Development

### Local Testing

1. Update source files
2. Reload the extension in `chrome://extensions/`
3. Re-test on supported sites

### Debugging

- Content script logs: page DevTools Console
- Service worker logs: extension service worker console in `chrome://extensions/`

Common checks:

- Validate JSON in `data/*.json`
- Confirm URLs include `https://`
- Verify extension is enabled and active on target sites

## Privacy and Permissions

This extension operates locally:

- No remote analytics
- No external data upload
- Settings and statistics are stored in browser storage

Permission purposes:

- `storage`: persist settings and usage data
- `tabs`: perform redirects
- `notifications`: display tier messages
- Host permissions: run detection script on selected sites

## Publishing

To publish on Chrome Web Store:

1. Register a developer account
2. Prepare listing assets and screenshots
3. Include a privacy policy
4. Submit through the developer console

## Customization

### Add More Sites

Add new `matches` entries in `manifest.json`, then define site-specific thresholds in `content/detector.js`.

### Add Redirect Themes

Create additional data files (for example, `tier1-nature.json`) and update load logic in `background/service-worker.js`.

## Known Limitations

- Settings changes may require page refresh before taking effect
- Chrome extensions are desktop-focused and do not run on mobile Chrome

## License

Add your preferred license before public release.
