import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getTopology, getItems } from "./routes/inventory";
import { createGRN } from "./routes/grn";
import { createTransfer } from "./routes/transfer";
import { createSale } from "./routes/pos";
import { getStockSummaryReport, getRecentMovements } from "./routes/reports";
import {
  getSettings,
  getSettingByKey,
  upsertSetting,
  updateSettings,
  initializeDefaultSettings,
} from "./routes/settings";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} from "./routes/purchasing";
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  getProductionOrders,
  createProductionOrder,
  updateProductionOrder,
  completeProductionOrder,
  startProductionOrder,
  getRecipeIngredients,
  addRecipeIngredient,
  updateRecipeIngredient,
  deleteRecipeIngredient,
} from "./routes/production";
import {
  getHotelRooms,
  upsertHotelRoom,
  getFolioByRoom,
  createFolio,
  addChargeToFolio,
  closeFolio,
} from "./routes/minibar";
import {
  getTableAreas,
  createTableArea,
  getDineInTables,
  upsertDineInTable,
  updateTableStatus,
  createTableOrder,
  completeTableOrder,
} from "./routes/dinein";
import {
  getDrivers,
  createDriver,
  updateDriver,
  getDeliveryOrders,
  createDeliveryOrder,
  assignDriver,
  updateDeliveryStatus,
  getDeliveryAreas,
  createDeliveryArea,
  updateDeliveryArea,
} from "./routes/delivery";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  submitToZatca,
  getInvoiceStats,
} from "./routes/einvoice";
import {
  getSalesReport,
  getInventoryValuation,
  getBestSellingItems,
  getPurchaseOrdersReport,
  getDeliveryPerformance,
} from "./routes/reports-advanced";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getUserActivity,
} from "./routes/users";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/inventory/topology", getTopology);
  app.get("/api/inventory/items", getItems);
  
  // Inventory operations
  app.post("/api/inventory/grn", createGRN);
  app.post("/api/inventory/transfer", createTransfer);
  
  // POS operations
  app.post("/api/pos/sale", createSale);
  
  // Reports
  app.get("/api/inventory/stock-summary", getStockSummaryReport);
  app.get("/api/inventory/movements", getRecentMovements);

  // Settings
  app.get("/api/settings", getSettings);
  app.get("/api/settings/:key", getSettingByKey);
  app.put("/api/settings/:key", upsertSetting);
  app.post("/api/settings", updateSettings);
  app.post("/api/settings/initialize", initializeDefaultSettings);

  // Purchasing
  app.get("/api/purchasing/suppliers", getSuppliers);
  app.post("/api/purchasing/suppliers", createSupplier);
  app.put("/api/purchasing/suppliers/:id", updateSupplier);
  app.get("/api/purchasing/orders", getPurchaseOrders);
  app.post("/api/purchasing/orders", createPurchaseOrder);
  app.patch("/api/purchasing/orders/:id/status", updatePurchaseOrderStatus);

  // Production
  app.get("/api/production/recipes", getRecipes);
  app.post("/api/production/recipes", createRecipe);
  app.put("/api/production/recipes/:id", updateRecipe);
  app.get("/api/production/recipes/:recipeId/ingredients", getRecipeIngredients);
  app.post("/api/production/recipes/:recipeId/ingredients", addRecipeIngredient);
  app.put("/api/production/recipe-ingredients/:ingredientId", updateRecipeIngredient);
  app.delete("/api/production/recipe-ingredients/:ingredientId", deleteRecipeIngredient);
  app.get("/api/production/orders", getProductionOrders);
  app.post("/api/production/orders", createProductionOrder);
  app.put("/api/production/orders/:id", updateProductionOrder);
  app.post("/api/production/orders/:id/start", startProductionOrder);
  app.post("/api/production/orders/:id/complete", completeProductionOrder);

  // Minibar / Hotel
  app.get("/api/minibar/rooms", getHotelRooms);
  app.post("/api/minibar/rooms", upsertHotelRoom);
  app.get("/api/minibar/folio/:roomId", getFolioByRoom);
  app.post("/api/minibar/folio", createFolio);
  app.post("/api/minibar/folio/charge", addChargeToFolio);
  app.post("/api/minibar/folio/:id/close", closeFolio);

  // Dine-In
  app.get("/api/dinein/areas", getTableAreas);
  app.post("/api/dinein/areas", createTableArea);
  app.get("/api/dinein/tables", getDineInTables);
  app.post("/api/dinein/tables", upsertDineInTable);
  app.patch("/api/dinein/tables/:id/status", updateTableStatus);
  app.post("/api/dinein/orders", createTableOrder);
  app.post("/api/dinein/orders/:orderId/complete", completeTableOrder);

  // Delivery
  app.get("/api/delivery/drivers", getDrivers);
  app.post("/api/delivery/drivers", createDriver);
  app.put("/api/delivery/drivers/:id", updateDriver);
  app.get("/api/delivery/areas", getDeliveryAreas);
  app.post("/api/delivery/areas", createDeliveryArea);
  app.put("/api/delivery/areas/:id", updateDeliveryArea);
  app.get("/api/delivery/orders", getDeliveryOrders);
  app.post("/api/delivery/orders", createDeliveryOrder);
  app.patch("/api/delivery/orders/:id/assign", assignDriver);
  app.patch("/api/delivery/orders/:id/status", updateDeliveryStatus);

  // E-Invoice
  app.get("/api/einvoice/invoices", getInvoices);
  app.get("/api/einvoice/invoices/:id", getInvoiceById);
  app.post("/api/einvoice/invoices", createInvoice);
  app.post("/api/einvoice/invoices/:id/submit", submitToZatca);
  app.get("/api/einvoice/stats", getInvoiceStats);

  // Advanced Reports
  app.get("/api/reports/sales", getSalesReport);
  app.get("/api/reports/inventory-valuation", getInventoryValuation);
  app.get("/api/reports/best-selling", getBestSellingItems);
  app.get("/api/reports/purchase-orders", getPurchaseOrdersReport);
  app.get("/api/reports/delivery-performance", getDeliveryPerformance);

  // Users & Roles
  app.get("/api/users", getUsers);
  app.get("/api/users/:id", getUserById);
  app.post("/api/users", createUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);
  app.post("/api/users/:id/change-password", changePassword);
  app.get("/api/users/:id/activity", getUserActivity);

  return app;
}
