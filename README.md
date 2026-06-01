# Forebytes Demo

AR-powered menu visualisation demo for Forebytes pilot restaurants.

## What this is
A demo web experience showing the full Forebytes flow:
QR code → hosted menu page → AR visualisation of a dish.

## Current Status
- AR model viewer working on iPhone via Safari
- GLB model loading and placing correctly on real surfaces

## Tech Stack
- HTML, CSS, JavaScript
- Google Model Viewer 3.4.0 (WebAR)
- Polycam (3D dish capture → GLB export)

## Repo Structure
- `/assets` — 3D models (GLB files) and images
- `/menu` — the menu web page
- `index.html` — AR viewer entry point

## Branching Rules
- `main` is always stable and demo-ready
- All work happens on feature branches
- Nothing merges to main without the other person reviewing it

## Running Locally
1. Open the project folder in VS Code
2. Install the Live Server extension
3. Right click `index.html` and select Open with Live Server
4. On mobile, connect to the same WiFi and open the Live Server URL in Safari (iPhone) or Chrome (Android)

## Next Steps
- [ ] Capture real dish models from pilot restaurants
- [ ] Build menu page with dish listings
- [ ] Add Visualise button per dish linking to AR view
- [ ] Set up GitHub Pages for shareable demo link
- [ ] QR code generation pointing to hosted demo
