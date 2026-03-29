import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Category, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private supabase = inject(SupabaseService);

  private _categories = signal<Category[]>([]);
  private _products   = signal<Product[]>([]);
  private _loading    = signal(false);
  private _error      = signal<string | null>(null);

  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  get categories(): Category[] { return this._categories(); }
  get products(): Product[]    { return this._products(); }

  constructor() {
    this.loadAll();
  }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const [catsRes, prodsRes] = await Promise.all([
        this.supabase.client
          .from('categories')
          .select('*')
          .order('id'),

        this.supabase.client
          .from('products')
          .select('*')
          .order('id')
      ]);

      if (catsRes.error)  throw catsRes.error;
      if (prodsRes.error) throw prodsRes.error;

      this._categories.set(
        (catsRes.data ?? []).map(r => ({
          id:          r.id,
          name:        r.name,
          subtitle:    r.subtitle,
          description: r.description,
          image:       r.image,
          color:       r.color
        }))
      );

      this._products.set(
        (prodsRes.data ?? []).map(r => ({
          id:          r.id,
          name:        r.name,
          description: r.description,
          price:       Number(r.price),
          categoryId:  r.category_id,
          image:       r.image,
          featured:    r.featured ?? false,
          badge:       r.badge ?? undefined
        }))
      );
    } catch (err: any) {
      console.error('DataService load error:', err);
      this._error.set(err?.message ?? 'Failed to load data');
    } finally {
      this._loading.set(false);
    }
  }

  getCategoryById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this._products().filter(p => p.categoryId === categoryId);
  }

  getFeaturedProducts(): Product[] {
    return this._products().filter(p => p.featured);
  }
}