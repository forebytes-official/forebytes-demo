const restaurant = {
  subdomain: 'anuskitchen',
  name:      "Anu's Kitchen",
  tagline:   'Authentic Nigerian Cuisine',
  eyebrow:   "Dublin's Finest Nigerian Kitchen",

  theme: {
    '--bg':         '#FEF7EE',
    '--header-bg':  '#1C0A00',
    '--accent':     '#C8860A',
    '--accent-dark':'#9A6408',
    '--text':       '#1C0A00',
    '--text-muted': '#7A5C48',
    '--card-bg':    '#FFFFFF',
    '--border':     '#EDD9C0',
    '--badge-bg':   '#FFF3DC',
    '--badge-text': '#92570A',
  },

  dishes: [
    {
      key:         'jollof-rice',
      name:        'Jollof Rice',
      price:       '€20.00',
      description: 'Smoky Nigerian jollof rice slow-cooked in a rich tomato and pepper base, served with your choice of grilled chicken, beef, or fish.',
      tags:        ['Gluten Free', ' Classic', 'Spicy'],
      image:       '/assets/images/jollof-rice.jpg',
      placeholder: { gradient: 'linear-gradient(145deg, #8B1A00 0%, #C8490A 45%, #E07020 100%)', emoji: '🍛' },
      model:       '/assets/models/jollof-rice.glb',
    },
    {
      key:         'pounded-yam-egusi',
      name:        'Pounded Yam & Egusi',
      price:       '€17.00',
      description: 'Traditional hand-pounded yam served with rich egusi soup — a hearty blend of ground melon seeds, leafy greens, and smoky stockfish.',
      tags:        ['Traditional', 'High Protein', "Spicy"],
      image:       '/assets/images/pounded-yam-egusi.jpg',
      placeholder: { gradient: 'linear-gradient(145deg, #4A3000 0%, #7A5500 45%, #C8A040 100%)', emoji: '🍲' },
      model:       '/assets/models/ponded-yam-egusi.glb',
    },
  ],
};

export default restaurant;
