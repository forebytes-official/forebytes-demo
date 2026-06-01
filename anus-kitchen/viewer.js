/* ============================================================
   Anu's Kitchen — AR Viewer

   To add a dish:
     1. Add its key → display name in DISHES
     2. Add its key → GLB path in MODELS
     3. Add a ?model=<key> href on the menu card in menu/index.html
   ============================================================ */

const DISHES = {
  'jollof-rice':       'Jollof Rice',
  'pounded-yam-egusi': 'Pounded Yam & Egusi',
};

const MODELS = {
  'jollof-rice':       '/assets/models/placeholder.glb',
  'pounded-yam-egusi': '/assets/models/placeholder.glb',
};

const params   = new URLSearchParams(location.search);
const modelKey = params.get('model');
const dishName = DISHES[modelKey] || '';
const modelSrc = MODELS[modelKey] || null;

const viewer        = document.getElementById('viewer');
const errorScreen   = document.getElementById('errorScreen');
const arUnsupported = document.getElementById('arUnsupported');

document.getElementById('headerDishName').textContent   = dishName;
document.getElementById('controlsDishName').textContent = dishName;
document.title = dishName ? `${dishName} — AR View` : 'AR View';

if (!modelKey) {
  location.replace('menu/');
} else if (!modelSrc) {
  errorScreen.classList.add('visible');
} else {
  viewer.setAttribute('src', modelSrc);
  viewer.setAttribute('alt', `3D model of ${dishName}`);
  viewer.addEventListener('error', () => errorScreen.classList.add('visible'));
}

document.getElementById('arBtn').addEventListener('click', () => {
  if (viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    arUnsupported.classList.add('visible');
  }
});
