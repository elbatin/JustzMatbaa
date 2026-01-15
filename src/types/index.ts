// ==========================================
// JustzMatbaa E-Commerce Platform Types
// ==========================================

// Product Types
export type ProductCategory = 
  | 'kartvizit' 
  | 'brosur' 
  | 'afis' 
  | 'katalog' 
  | 'ozel-baski';

export interface SizeOption {
  id: string;
  name: string;
  dimensions: string;
  multiplier: number;
}

export interface PaperTypeOption {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

export interface PrintSideOption {
  id: string;
  name: string;
  multiplier: number;
}

export interface PrintOptions {
  sizes: SizeOption[];
  paperTypes: PaperTypeOption[];
  printSides: PrintSideOption[];
  quantities: number[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  basePrice: number;
  images: string[];
  printOptions: PrintOptions;
  featured?: boolean;
  createdAt: string;
}

// Selected Options
export interface SelectedPrintOptions {
  sizeId: string;
  paperTypeId: string;
  printSideId: string;
  quantity: number;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  selectedOptions: SelectedPrintOptions;
  calculatedPrice: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// User & Auth Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Dashboard Statistics
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  bestSellingProduct: {
    productId: string;
    productName: string;
    quantity: number;
  } | null;
}

// Form Validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Log Types
export type LogActionType = 
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'UPDATE_CART_QUANTITY'
  | 'CHECKOUT_START'
  | 'CHECKOUT_COMPLETE'
  | 'ADMIN_ADD_PRODUCT'
  | 'ADMIN_DELETE_PRODUCT'
  | 'ADMIN_LOGIN'
  | 'ADMIN_LOGOUT';

export interface LogEntry {
  id: string;
  action: LogActionType;
  timestamp: string;
  data?: Record<string, unknown>;
}

// Category Info for UI
export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
  image: string;
}

// Price Calculation
export interface PriceCalculationInput {
  basePrice: number;
  sizeMultiplier: number;
  paperTypeMultiplier: number;
  printSideMultiplier: number;
  quantity: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
