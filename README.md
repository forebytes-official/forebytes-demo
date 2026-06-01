# Forebytes Demo

AR-powered menu visualisation demos for Forebytes pilot restaurants.

Customers scan a QR code, see the restaurant menu on their phone, tap **Visualise in AR** on any dish, and see it at real scale on their table — no app download required.

---

## Tech Stack

| Layer | Tool |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router v6 |
| AR / 3D | [Google Model Viewer 3.4.0](https://modelviewer.dev) |
| 3D Capture | Polycam (iPhone LiDAR → GLB export) |
| Hosting | Vercel — one deployment, subdomain per restaurant |

---

## Repo Structure

```
forebytes-demo/
│
├── public/
│   └── assets/
│       ├── models/        # GLB files for all restaurants
│       └── images/        # Dish photos for all restaurants
│
├── src/
│   ├── components/
│   │   ├── Header/        # MenuHeader + ViewerHeader variants
│   │   ├── DishCard/      # Single dish card (image, name, price, AR button)
│   │   ├── ARViewer/      # Full-screen model viewer + controls
│   │   └── Footer/        # Forebytes branding footer
│   │
│   ├── pages/
│   │   ├── MenuPage.jsx   # Hero + dish list — QR code lands here
│   │   └── ViewerPage.jsx # Resolves dish key → renders ARViewer
│   │
│   ├── restaurants/
│   │   ├── anus-kitchen.js  # Anu's Kitchen config + dish data
│   │   └── index.js         # Subdomain → restaurant map (edit this to add restaurants)
│   │
│   ├── hooks/
│   │   └── useRestaurant.js # Reads window.location.hostname → returns config
│   │
│   ├── App.jsx              # Router + injects restaurant theme into CSS variables
│   └── index.css            # Global reset + default CSS custom properties
│
├── index.html               # Vite HTML entry point
├── vite.config.js
├── vercel.json              # SPA rewrite — all routes serve index.html
└── package.json
```

---

## Demo Flow

```
QR code → /menu  →  tap Visualise  →  /view/:dishKey
             ↑                               ↑
        MenuPage.jsx                   ViewerPage.jsx
         + DishCard                     + ARViewer
```

Subdomain routing: `anuskitchen.forebytes.com` → `useRestaurant()` reads the subdomain → loads Anu's Kitchen config → all components render from that config.

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — defaults to Anu's Kitchen in development.

> AR requires a physical device. It will not work in a desktop browser.

---

## Adding a New Restaurant

### 1. Create the restaurant config

Copy the existing config as a template:

```bash
cp src/restaurants/anus-kitchen.js src/restaurants/<slug>.js
```

Edit the new file — update the restaurant name, tagline, theme colours, and dish data:

```js
const restaurant = {
  subdomain: '<slug>',          // must match the subdomain, e.g. 'aperitivo'
  name:      'Restaurant Name',
  tagline:   'Cuisine type',
  eyebrow:   'Location tagline',

  theme: {
    '--header-bg':  '#...',     // main brand colour
    '--accent':     '#...',     // gold / highlight colour
    // ... other colour tokens
  },

  dishes: [
    {
      key:         'dish-slug',
      name:        'Dish Name',
      price:       '€00.00',
      description: '...',
      tags:        ['Tag 1', 'Tag 2'],
      image:       '/assets/images/dish-slug.jpg',
      placeholder: { gradient: 'linear-gradient(...)', emoji: '🍽️' },
      model:       '/assets/models/dish-slug.glb',
    },
  ],
};

export default restaurant;
```

### 2. Register the restaurant

Open `src/restaurants/index.js` and add one import and one entry:

```js
import anusKitchen  from './anus-kitchen';
import newRestaurant from './<slug>';        // ← add this

const restaurants = {
  anuskitchen:  anusKitchen,
  '<slug>':     newRestaurant,               // ← and this
  localhost:    anusKitchen,
};
```

### 3. Add the assets

| File | Location |
|---|---|
| Dish photo (JPG) | `public/assets/images/<dish-slug>.jpg` |
| 3D model (GLB) | `public/assets/models/<dish-slug>.glb` |

### 4. Deploy & configure the subdomain on Vercel

1. Push to `main`
2. In the Vercel project dashboard → **Domains** → add `<slug>.forebytes.com`
3. Vercel routes all traffic to the same deployment — `useRestaurant()` handles the rest

---

## Capturing 3D Models (Polycam)

1. Open Polycam on iPhone 16 Pro
2. Select **LiDAR** mode
3. Scan the dish from multiple angles — aim for full coverage of the top and sides
4. Export as **GLB**
5. Drop the file into `public/assets/models/` named `<dish-slug>.glb`
6. Update the `model` field in the restaurant config

---

## Branching Rules

- `main` is always stable and demo-ready
- All work happens on feature branches (`feature/<description>`)
- Nothing merges to `main` without the other person reviewing it

---

## Deployment

One Vercel project, one deployment. Each restaurant gets its own subdomain pointed at the same project.

| Restaurant | URL |
|---|---|
| Anu's Kitchen | `anuskitchen.forebytes.com` |
| _(next restaurant)_ | _(TBC)_ |

QR codes should point directly to `https://<slug>.forebytes.com/menu`.
