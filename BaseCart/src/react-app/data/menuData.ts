export interface MenuItem {
  name: string;
  description: string;
  price: string;
  icon: string;
}

export interface MenuCategory {
  slug: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    slug: 'espresso',
    name: 'ESPRESSO DRINKS',
    icon: 'fa-mug-hot',
    items: [
      { name: 'Americano', description: 'Double shot with hot water', price: '$4.50', icon: 'fa-coffee' },
      { name: 'Cappuccino', description: 'Espresso, steamed milk, foam', price: '$5.00', icon: 'fa-mug-hot' },
      { name: 'Flat White', description: 'Ristretto shots, microfoam', price: '$5.50', icon: 'fa-coffee' },
      { name: 'Latte', description: 'Espresso with steamed milk', price: '$5.00', icon: 'fa-mug-hot' },
      { name: 'Mocha', description: 'Espresso, chocolate, steamed milk', price: '$5.50', icon: 'fa-coffee' },
      { name: 'Macchiato', description: 'Espresso marked with foam', price: '$4.00', icon: 'fa-mug-hot' },
    ]
  },
  {
    slug: 'cold-brew',
    name: 'COLD BREW',
    icon: 'fa-glass-whiskey',
    items: [
      { name: 'Classic Cold Brew', description: 'Smooth 16-hour cold brew', price: '$4.50', icon: 'fa-glass-whiskey' },
      { name: 'Vanilla Cold Brew', description: 'Cold brew with vanilla syrup', price: '$5.00', icon: 'fa-blender' },
      { name: 'Nitro Cold Brew', description: 'Nitrogen-infused smoothness', price: '$6.00', icon: 'fa-glass-whiskey' },
    ]
  },
  {
    slug: 'pastries',
    name: 'PASTRIES',
    icon: 'fa-bread-slice',
    items: [
      { name: 'Butter Croissant', description: 'Flaky, buttery perfection', price: '$3.50', icon: 'fa-bread-slice' },
      { name: 'Almond Croissant', description: 'Filled with almond cream', price: '$4.50', icon: 'fa-cookie' },
      { name: 'Cinnamon Roll', description: 'Warm with cream cheese frosting', price: '$4.00', icon: 'fa-birthday-cake' },
      { name: 'Blueberry Muffin', description: 'Fresh baked daily', price: '$3.00', icon: 'fa-bread-slice' },
      { name: 'Chocolate Chip Cookie', description: 'Chewy and delicious', price: '$2.50', icon: 'fa-cookie' },
      { name: 'Banana Bread', description: 'Moist with walnuts', price: '$3.50', icon: 'fa-birthday-cake' },
    ]
  },
  {
    slug: 'merchandise',
    name: 'MERCHANDISE',
    icon: 'fa-shopping-bag',
    items: [
      { name: 'Golden Hour Mug', description: 'Ceramic 12oz coffee mug', price: '$12.00', icon: 'fa-mug-hot' },
      { name: 'Coffee Beans', description: 'House blend 12oz bag', price: '$15.00', icon: 'fa-shopping-bag' },
      { name: 'Branded T-Shirt', description: '100% organic cotton', price: '$20.00', icon: 'fa-tshirt' },
    ]
  }
];

export const getCategoryBySlug = (slug: string): MenuCategory | undefined => {
  return menuCategories.find(cat => cat.slug === slug);
};
