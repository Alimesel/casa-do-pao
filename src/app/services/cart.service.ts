import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _isOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product): void {
    const existing = this._items().find(i => i.product.id === product.id);
    if (existing) {
      this._items.update(items =>
        items.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
        )
      );
    } else {
      this._items.update(items => [...items, { product, quantity: 1 }]);
    }
    this.openCart();
  }

  removeFromCart(productId: number): void {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }

  clearCart(): void {
    this._items.set([]);
  }

  openCart(): void {
    this._isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeCart(): void {
    this._isOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleCart(): void {
    if (this._isOpen()) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }
}