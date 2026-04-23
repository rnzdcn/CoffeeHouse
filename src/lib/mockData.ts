export type Category = 'coffee' | 'milky' | 'bobaan' | 'ice-cream' | 'dessert'

export type Product = {
  id: string
  name: string
  category: Category
  description: string
  price: number
  imageUrl: string
}

export type CategoryTab = {
  id: 'all' | Category
  label: string
  emoji: string
}

export const categoryTabs: CategoryTab[] = [
  { id: 'all', label: 'All menu', emoji: '🍽️' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'milky', label: 'Milky milk', emoji: '🥛' },
  { id: 'bobaan', label: 'Bobaan', emoji: '🧋' },
  { id: 'ice-cream', label: 'Ice cream', emoji: '🍦' },
  { id: 'dessert', label: 'Dessert', emoji: '🍰' },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    category: 'coffee',
    description: 'Rich and bold single shot of pure espresso',
    price: 3.5,
    imageUrl:
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80',
  },
  {
    id: '2',
    name: 'Cappuccino',
    category: 'coffee',
    description: 'Espresso with steamed milk and thick foam crown',
    price: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&q=80',
  },
  {
    id: '3',
    name: 'Caramel Latte',
    category: 'coffee',
    description: 'Smooth latte topped with sweet caramel drizzle',
    price: 5.2,
    imageUrl:
      'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&q=80',
  },
  {
    id: '4',
    name: 'Cold Brew',
    category: 'coffee',
    description: 'Slow-steeped for 12 hours, served over ice',
    price: 5.5,
    imageUrl:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80',
  },
  {
    id: '5',
    name: 'Mocha',
    category: 'coffee',
    description: 'Espresso blended with rich chocolate and steamed milk',
    price: 5.0,
    imageUrl:
      'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&q=80',
  },
  {
    id: '6',
    name: 'Matcha Latte',
    category: 'milky',
    description: 'Premium ceremonial matcha whisked with oat milk',
    price: 5.8,
    imageUrl:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&q=80',
  },
  {
    id: '7',
    name: 'Strawberry Milk',
    category: 'milky',
    description: 'Fresh strawberry purée blended with creamy whole milk',
    price: 4.5,
    imageUrl:
      'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80',
  },
  {
    id: '8',
    name: 'Brown Sugar Boba',
    category: 'bobaan',
    description: 'Tiger milk tea with caramelised brown sugar pearls',
    price: 6.0,
    imageUrl:
      'https://images.unsplash.com/photo-1558857563-b371033873b8?w=300&q=80',
  },
  {
    id: '9',
    name: 'Taro Boba',
    category: 'bobaan',
    description: 'Creamy taro milk tea with chewy tapioca pearls',
    price: 6.2,
    imageUrl:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80',
  },
  {
    id: '10',
    name: 'Vanilla Soft Serve',
    category: 'ice-cream',
    description: 'Creamy vanilla swirl in a crispy waffle cone',
    price: 4.0,
    imageUrl:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80',
  },
  {
    id: '11',
    name: 'Affogato',
    category: 'ice-cream',
    description: 'Vanilla gelato drowned in a shot of hot espresso',
    price: 6.5,
    imageUrl:
      'https://images.unsplash.com/photo-1519048329892-7a35fce8fe84?w=300&q=80',
  },
  {
    id: '12',
    name: 'Chocolate Fondant',
    category: 'dessert',
    description: 'Warm molten chocolate cake with vanilla ice cream',
    price: 7.5,
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80',
  },
  {
    id: '13',
    name: 'French Macaron',
    category: 'dessert',
    description: 'Assorted French macarons, three pieces per serving',
    price: 5.0,
    imageUrl:
      'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=300&q=80',
  },
]

export type MockOrder = {
  id: string
  orderNumber: string
  items: { name: string; qty: number }[]
  status: 'pending' | 'preparing' | 'ready'
  time: string
  total: number
}

export const mockOrders: MockOrder[] = [
  {
    id: 'o1',
    orderNumber: '#1001',
    items: [
      { name: 'Cappuccino', qty: 2 },
      { name: 'Chocolate Fondant', qty: 1 },
    ],
    status: 'preparing',
    time: '2 min ago',
    total: 17.1,
  },
  {
    id: 'o2',
    orderNumber: '#1002',
    items: [
      { name: 'Cold Brew', qty: 1 },
      { name: 'French Macaron', qty: 2 },
    ],
    status: 'pending',
    time: '5 min ago',
    total: 15.5,
  },
  {
    id: 'o3',
    orderNumber: '#1003',
    items: [
      { name: 'Brown Sugar Boba', qty: 3 },
      { name: 'Vanilla Soft Serve', qty: 1 },
    ],
    status: 'ready',
    time: '8 min ago',
    total: 22.0,
  },
  {
    id: 'o4',
    orderNumber: '#1004',
    items: [{ name: 'Matcha Latte', qty: 2 }],
    status: 'pending',
    time: '10 min ago',
    total: 11.6,
  },
  {
    id: 'o5',
    orderNumber: '#1005',
    items: [
      { name: 'Espresso', qty: 1 },
      { name: 'Taro Boba', qty: 1 },
    ],
    status: 'preparing',
    time: '12 min ago',
    total: 9.7,
  },
]
