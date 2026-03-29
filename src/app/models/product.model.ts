export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
}
