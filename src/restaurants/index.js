import anusKitchen from './anus-kitchen';
import aperitivoatthecafe from './aperitivo';

/*
  To add a new restaurant:
  1. Create src/restaurants/<slug>.js  (copy anus-kitchen.js as a template)
  2. Import it here and add an entry below — key must match the subdomain
  3. On Vercel, add <subdomain>.forebytes.com pointing to this project
*/

const restaurants = {
  anuskitchen:          anusKitchen,
  aperitivioatthecafe:  aperitivoatthecafe,
  localhost:            anusKitchen,
};

export default restaurants;
