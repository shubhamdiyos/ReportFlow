import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  githubId: text("github_id").unique(),
  role: text("role").notNull().default("developer"), // Global role for backward compatibility: "admin" | "manager" | "developer"
  isOnboarded: boolean("is_onboarded").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").unique(),
  logo: text("logo"),
  type: text("type").notNull().default("organization"), // "individual" | "organization"
  createdAt: timestamp("created_at").defaultNow(),
});

export const userOrganizations = pgTable("user_organizations", {
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("developer"), // "admin" | "manager" | "developer"
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.organizationId] })
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  name: true,
  email: true,
  avatar: true,
  githubId: true,
  role: true,
  isOnboarded: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  domain: true,
  logo: true,
  type: true,
});

export const insertUserOrganizationSchema = createInsertSchema(userOrganizations).pick({
  userId: true,
  organizationId: true,
  role: true,
  isActive: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

export type InsertUserOrganization = z.infer<typeof insertUserOrganizationSchema>;
export type UserOrganization = typeof userOrganizations.$inferSelect;

// Signup form validation schemas
export const signupStep1Schema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
  accountType: z.enum(["individual", "organization"], {
    required_error: "Please select an account type"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const signupStep2Schema = z.object({
  organizationName: z.string().min(1, "Organization name is required").max(100, "Organization name must be less than 100 characters"),
  domain: z.string()
    .min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/, "Please enter a valid domain (e.g., company.com)"),
  logo: z.string().optional()
});

export type SignupStep1 = z.infer<typeof signupStep1Schema>;
export type SignupStep2 = z.infer<typeof signupStep2Schema>;

// Billing form validation schemas
export const paymentMethodSchema = z.object({
  cardNumber: z.string()
    .min(1, "Card number is required")
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Please enter a valid 16-digit card number"),
  expiryMonth: z.string()
    .min(1, "Expiry month is required"),
  expiryYear: z.string()
    .min(1, "Expiry year is required"),
  cvc: z.string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits")
    .regex(/^\d{3,4}$/, "CVC must contain only digits"),
  holderName: z.string()
    .min(1, "Cardholder name is required")
    .min(2, "Cardholder name must be at least 2 characters")
    .max(50, "Cardholder name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Cardholder name can only contain letters and spaces")
});

export type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;
