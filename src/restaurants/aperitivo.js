const restaurant = {
  subdomain: 'aperitivo',
  name:      'Aperitivo at the Cafe',
  tagline:   'Italian Café & Restaurant',
  eyebrow:   'Glasthule Village — A Taste of Italy',

  theme: {
    '--bg':         '#FFFBF5',
    '--header-bg':  '#1A2E1A',
    '--accent':     '#B8860B',
    '--accent-dark':'#8B6508',
    '--text':       '#1A2E1A',
    '--text-muted': '#6B5D4F',
    '--card-bg':    '#FFFFFF',
    '--border':     '#DDD5C5',
    '--badge-bg':   '#F0E8D4',
    '--badge-text': '#7A5C10',
  },

  dishes: [
    {
      key:         'tagliolini-ragu',
      name:        'Tagliolini al Ragù di Black Angus',
      price:       '€25.00',
      description: 'Fresh tagliolini folded through a slow-braised Irish Black Angus beef ragù, enriched with red wine, fresh tomatoes, and finished with aged parmesan.',
      tags:        ['Signature', 'Pasta', 'Slow-Braised'],
      image:       '/assets/images/tagliolini-ragu.jpg',
      placeholder: { gradient: 'linear-gradient(145deg, #5C1A00 0%, #8B3A10 40%, #C06030 100%)', emoji: '🍝' },
      model:       '/assets/models/placeholder.glb',
    },
    {
      key:         'pizza-primavera',
      name:        'Pizza Primavera',
      price:       '€22.00',
      description: 'Tomato sauce, buffalo mozzarella, premium Parma ham, topped with fresh rocket and sprinkles of aged parmesan.',
      tags:        ['Pizza', 'Popular', 'Parma Ham'],
      image:       '/assets/images/pizza-primavera.jpg',
      placeholder: { gradient: 'linear-gradient(145deg, #6B2D0A 0%, #B85C28 40%, #D4944A 100%)', emoji: '🍕' },
      model:       '/assets/models/placeholder.glb',
    },
  ],
};

export default restaurant;
