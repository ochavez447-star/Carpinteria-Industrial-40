import {
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductWithCategory,
  type Order,
  type InsertOrder,
  type OrderWithItems,
  type InsertOrderItem,
  type OrderItem,
  type ContactRequest,
  type InsertContactRequest,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getProducts(filters?: { categoryId?: number; search?: string; featured?: boolean; limit?: number }): Promise<ProductWithCategory[]>;
  getProductById(id: number): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, quantity: number): Promise<void>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<OrderWithItems | undefined>;
  getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined>;
  getUserOrders(userId: string): Promise<OrderWithItems[]>;
  updateOrderStatus(id: number, status: string, trackingNumber?: string, carrier?: string): Promise<Order>;
  updateOrderPaymentStatus(id: number, paymentStatus: string, stripePaymentIntentId?: string): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  createOrderItems(orderItems: InsertOrderItem[]): Promise<OrderItem[]>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
  updateContactRequestStatus(id: number, status: string): Promise<ContactRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private contactRequests: Map<number, ContactRequest>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contactRequests = new Map();
    this.currentId = {
      categories: 1,
      products: 1,
      orders: 1,
      orderItems: 1,
      contactRequests: 1,
    };

    this.seed();
  }

  private seed() {
    const cats: InsertCategory[] = [
      { name: "Vestidor", slug: "dressing", description: "Organización y elegancia para tu ropa", imageUrl: "/attached_assets/Vestidor_pagina_1768180108306.png" },
      { name: "Utensilios de cocina", slug: "kitchen-tools", description: "Todo lo necesario para tu cocina", imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511" },
      { name: "Closet", slug: "closet", description: "Soluciones de almacenamiento a medida", imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2" },
    ];
    cats.forEach(c => this.createCategory(c));

    const prods: InsertProduct[] = [
      {
        name: "Mesa de Centro CNC",
        description: "Mesa elegante cortada con precisión milimétrica",
        price: "2500.00",
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88",
        inStock: true,
        stockQuantity: 10,
        featured: true,
      },
      {
        name: "Estante Modular",
        description: "Sistema de estantería encajable sin tornillos",
        price: "1800.00",
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156",
        inStock: true,
        stockQuantity: 5,
        featured: true,
      }
    ];
    prods.forEach(p => this.createProduct(p));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      stripeCustomerId: userData.stripeCustomerId || null,
      stripeSubscriptionId: userData.stripeSubscriptionId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    const updated = { ...user, stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId || null, updatedAt: new Date() };
    this.users.set(userId, updated);
    return updated;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId.categories++;
    const newCategory: Category = { ...category, id, description: category.description || null, imageUrl: category.imageUrl || null };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async getProducts(filters: { categoryId?: number; search?: string; featured?: boolean; limit?: number } = {}): Promise<ProductWithCategory[]> {
    let prods = Array.from(this.products.values()).map(p => ({
      ...p,
      category: p.categoryId ? this.categories.get(p.categoryId) || null : null
    }));

    if (filters.categoryId) prods = prods.filter(p => p.categoryId === filters.categoryId);
    if (filters.featured !== undefined) prods = prods.filter(p => p.featured === filters.featured);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }

    prods = prods.filter(p => p.inStock);
    prods.sort((a, b) => {
      const timeA = (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
      const timeB = (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
      return timeB - timeA;
    });
    if (filters.limit) prods = prods.slice(0, filters.limit);

    return prods;
  }

  async getProductById(id: number): Promise<ProductWithCategory | undefined> {
    const p = this.products.get(id);
    if (!p) return undefined;
    return { ...p, category: p.categoryId ? this.categories.get(p.categoryId) || null : null };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const newProduct: Product = {
      ...product,
      id,
      originalPrice: product.originalPrice || null,
      categoryId: product.categoryId || null,
      images: product.images || null,
      inStock: product.inStock ?? true,
      stockQuantity: product.stockQuantity ?? 0,
      featured: product.featured ?? false,
      tags: product.tags || null,
      dimensions: product.dimensions || null,
      material: product.material || null,
      color: product.color || null,
      weight: product.weight || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProductStock(id: number, quantity: number): Promise<void> {
    const p = this.products.get(id);
    if (p) {
      const newStock = (p.stockQuantity || 0) - quantity;
      this.products.set(id, { ...p, stockQuantity: newStock, updatedAt: new Date() });
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId.orders++;
    const orderNumber = `MP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const newOrder: Order = {
      ...order,
      id,
      orderNumber,
      userId: order.userId || null,
      status: order.status || "pending",
      paymentStatus: order.paymentStatus || "pending",
      stripePaymentIntentId: order.stripePaymentIntentId || null,
      trackingNumber: order.trackingNumber || null,
      carrier: order.carrier || null,
      estimatedDelivery: order.estimatedDelivery || null,
      deliveredAt: order.deliveredAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const items = Array.from(this.orderItems.values())
      .filter(i => i.orderId === id)
      .map(i => ({ ...i, product: i.productId ? this.products.get(i.productId) || null : null }));
    return { ...order, items };
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined> {
    const order = Array.from(this.orders.values()).find(o => o.orderNumber === orderNumber);
    if (!order) return undefined;
    return this.getOrderById(order.id);
  }

  async getUserOrders(userId: string): Promise<OrderWithItems[]> {
    const userOrders = Array.from(this.orders.values()).filter(o => o.userId === userId);
    const results: OrderWithItems[] = [];
    for (const o of userOrders) {
      const full = await this.getOrderById(o.id);
      if (full) results.push(full);
    }
    return results.sort((a, b) => {
      const timeA = (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
      const timeB = (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
      return timeB - timeA;
    });
  }

  async updateOrderStatus(id: number, status: string, trackingNumber?: string, carrier?: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    const updated = { ...order, status, trackingNumber: trackingNumber || order.trackingNumber, carrier: carrier || order.carrier, updatedAt: new Date() };
    if (status === 'delivered') updated.deliveredAt = new Date();
    this.orders.set(id, updated);
    return updated;
  }

  async updateOrderPaymentStatus(id: number, paymentStatus: string, stripePaymentIntentId?: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    const updated = { ...order, paymentStatus, stripePaymentIntentId: stripePaymentIntentId || order.stripePaymentIntentId, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentId.orderItems++;
    const newItem: OrderItem = { ...orderItem, id, orderId: orderItem.orderId || null, productId: orderItem.productId || null, createdAt: new Date() };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  async createOrderItems(orderItemsData: InsertOrderItem[]): Promise<OrderItem[]> {
    const results: OrderItem[] = [];
    for (const data of orderItemsData) {
      results.push(await this.createOrderItem(data));
    }
    return results;
  }

  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const id = this.currentId.contactRequests++;
    const newReq: ContactRequest = {
      ...request,
      id,
      phone: request.phone || null,
      status: request.status || "new",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contactRequests.set(id, newReq);
    return newReq;
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateContactRequestStatus(id: number, status: string): Promise<ContactRequest> {
    const req = this.contactRequests.get(id);
    if (!req) throw new Error("Request not found");
    const updated = { ...req, status, updatedAt: new Date() };
    this.contactRequests.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
