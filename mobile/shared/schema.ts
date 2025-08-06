// Shared types and schemas for the React Native app
// This mirrors the web app's schema but uses only Zod validation (no Drizzle for mobile)
import { z } from "zod";

// User schema matching the web app
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = userSchema.pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// Picklist data structure from the web app
export interface Picklist {
  id: string;
  orderNumber: string;
  customerName: string;
  numberOfItems: number;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  paymentMethod: string;
  channel: string;
  shelfCode?: string;
}

// SKU/Product data structure
export interface SKUItem {
  id: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  quantity: number;
  scannedQuantity: number;
  batchNumber: string;
  expiryDate: string;
  cost: number;
  shelfLocation: string;
}

// Shelf data structure
export interface Shelf {
  id: string;
  code: string;
  section: string;
  level: number;
  items: SKUItem[];
}

// Barcode mode context type
export interface BarcodeModeContextType {
  barcodeMode: boolean;
  setBarcodeMode: (mode: boolean) => void;
}