# Forebytes Demo

AR-powered menu visualisation demos for Forebytes pilot restaurants.

Customers scan a QR code, see the restaurant menu on their phone, tap **Visualise in AR** on any dish, and see it at real scale on their table — no app download required.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, no framework) |
| Logic | Vanilla JavaScript (ES6+) |
| AR / 3D | [Google Model Viewer 3.4.0](https://modelviewer.dev) |
| 3D Capture | Polycam (iPhone LiDAR → GLB export) |
| Hosting | GitHub Pages + Forebytes subdomain |

---

## Repo Structure

```
forebytes-demo/
│
├── <restaurant-slug>/          # One folder per restaurant
│   ├── index.html              # AR viewer — loads the GLB, triggers AR
│   ├── viewer.css              # AR viewer styles
│   ├── viewer.js               # AR logic + dish/model map
│   └── menu/
│       ├── index.html          # Menu page — QR code lands here
│       └── menu.css            # Menu page styles
│
└── assets/
    ├── models/                 # GLB files for every restaurant
    └── images/                 # Dish photos for every restaurant
```

Current restaurants:

- [`anus-kitchen/`](anus-kitchen/) — Anu's Kitchen Dublin (pilot 1)

---

## Demo Flow

```
QR code → /<restaurant>/menu/   →   tap Visualise   →   /<restaurant>/?model=<dish>
                 ↑                                               ↑
          menu/index.html                                   index.html
           + menu.css                                   viewer.css + viewer.js
```

---

## Running Locally

1. Open the project folder in VS Code
2. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
3. Right-click any `index.html` and select **Open with Live Server**
4. On mobile — connect to the same WiFi network and open the Live Server URL in Safari (iPhone) or Chrome (Android)

> AR requires a physical device. It will not work in a desktop browser.

---

## Adding a New Restaurant

### 1. Create the folder structure

Copy an existing restaurant folder and rename it:

```
cp -r anus-kitchen/ <new-restaurant-slug>/
```

### 2. Update the menu page

In `<new-restaurant-slug>/menu/index.html`, replace all instances of the restaurant name, cuisine description, dish names, prices, descriptions, and tags with the new restaurant's content.

For each dish card, set the `href` on the Visualise button:

```html
<a class="btn-visualise" href="../?model=<dish-key>">
```

### 3. Update the viewer data

In `<new-restaurant-slug>/viewer.js`, update `DISHES` and `MODELS` at the top of the file:

```js
const DISHES = {
  'dish-key': 'Dish Display Name',
  // add more dishes here
};

const MODELS = {
  'dish-key': '/assets/models/<dish-key>.glb',
  // add more dishes here
};
```

### 4. Drop in the assets

| File | Location |
|---|---|
| Dish photos (JPG) | `/assets/images/<dish-key>.jpg` |
| 3D models (GLB) | `/assets/models/<dish-key>.glb` |

The menu page `<img>` tags already point to `/assets/images/<dish-key>.jpg` — adding the file is all that's needed. Same for GLB paths in `viewer.js`.

### 5. Customise the styles (optional)

`menu.css` and `viewer.css` are fully independent per restaurant. Update the CSS custom properties in `:root` to match the restaurant's brand colours:

```css
:root {
  --header-bg: /* restaurant primary colour */;
  --accent:    /* restaurant accent colour */;
}
```

---

## Branching Rules

- `main` is always stable and demo-ready
- All work happens on feature branches (`feature/<description>`)
- Nothing merges to `main` without the other person reviewing it

---

## Capturing 3D Models (Polycam)

1. Open Polycam on iPhone 16 Pro
2. Select **LiDAR** mode
3. Scan the dish from multiple angles — aim for full coverage of the top and sides
4. Export as **GLB**
5. Drop the file into `/assets/models/` named `<dish-key>.glb`
6. Update `MODELS` in the restaurant's `viewer.js`

---

## Deployment

Each restaurant demo is hosted on a Forebytes subdomain. The subdomain serves the root of this repo, so paths like `/anus-kitchen/menu/` and `/assets/models/` resolve correctly.

| Restaurant | URL |
|---|---|
| Anu's Kitchen | `anuskitchen.forebytes.com/anus-kitchen/menu/` |
| _(next restaurant)_ | _(TBC)_ |

QR codes should point directly to the `/menu/` page for the relevant restaurant.
