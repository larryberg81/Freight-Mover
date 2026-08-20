import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const shipmentsTable = pgTable("shipments", {
  trackingId: text("tracking_id").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ShipmentRow = typeof shipmentsTable.$inferSelect;
export type InsertShipmentRow = typeof shipmentsTable.$inferInsert;
