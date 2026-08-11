import anusKitchen from './anus-kitchen';

/*
  To add a new restaurant:
  1. Create src/restaurants/<slug>.js  (copy anus-kitchen.js as a template)
  2. Import it here and add an entry below — key must match the subdomain
  3. On Vercel, add <subdomain>.forebytes.com pointing to this project
*/

const restaurants = {
  anuskitchen: anusKitchen,
  localhost:   anusKitchen,   // change this to whichever you're currently testing
};

export default restaurants;
