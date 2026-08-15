export interface MenuItem {
  id: string
  name: string
  nameAr: string
  price: number
  category: string
}

export const DEMO_MENU: MenuItem[] = [
  { id: 'm1', name: 'Koshary — Large', nameAr: 'كشري كبير', price: 65, category: 'Koshary' },
  { id: 'm2', name: 'Koshary — Medium', nameAr: 'كشري وسط', price: 50, category: 'Koshary' },
  { id: 'm3', name: 'Koshary — Small', nameAr: 'كشري صغير', price: 35, category: 'Koshary' },
  { id: 'm4', name: 'Meat Casserole', nameAr: 'طاجن لحمة', price: 95, category: 'Casserole' },
  { id: 'm5', name: 'Chicken Casserole', nameAr: 'طاجن فراخ', price: 80, category: 'Casserole' },
  { id: 'm6', name: 'Grilled Rice Side', nameAr: 'أرز بالشعرية', price: 20, category: 'Sides' },
  { id: 'm7', name: 'Garlic Sauce Extra', nameAr: 'دقة تومية', price: 10, category: 'Extras' },
  { id: 'm8', name: 'Soft Drink', nameAr: 'مشروب غازي', price: 15, category: 'Drinks' },
]

export function findMenuItem(nameAr: string): MenuItem | undefined {
  return DEMO_MENU.find((item) => item.nameAr === nameAr)
}
