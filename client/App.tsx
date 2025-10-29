import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Purchasing from "./pages/Purchasing";
import Minibar from "./pages/Minibar";
import Production from "./pages/Production";
import POS from "./pages/POS";
import DineIn from "./pages/DineIn";
import Delivery from "./pages/Delivery";
import EInvoice from "./pages/EInvoice";
import Reports from "./pages/Reports";
import UsersRoles from "./pages/UsersRoles";
import Settings from "./pages/Settings";
import GoodsReceipt from "./pages/GoodsReceipt";
import StockTransfer from "./pages/StockTransfer";
import POSSale from "./pages/POSSale";
import StockRecords from "./pages/StockRecords";
import InventoryReports from "./pages/InventoryReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/inventory"
            element={
              <Layout>
                <Inventory />
              </Layout>
            }
          />
          <Route
            path="/purchasing"
            element={
              <Layout>
                <Purchasing />
              </Layout>
            }
          />
          <Route
            path="/production"
            element={
              <Layout>
                <Production />
              </Layout>
            }
          />
          <Route
            path="/pos"
            element={
              <Layout>
                <POS />
              </Layout>
            }
          />
          <Route
            path="/dine-in"
            element={
              <Layout>
                <DineIn />
              </Layout>
            }
          />
          <Route
            path="/delivery"
            element={
              <Layout>
                <Delivery />
              </Layout>
            }
          />
          <Route
            path="/minibar"
            element={
              <Layout>
                <Minibar />
              </Layout>
            }
          />
          <Route
            path="/reports"
            element={
              <Layout>
                <Reports />
              </Layout>
            }
          />
          <Route
            path="/einvoice"
            element={
              <Layout>
                <EInvoice />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout>
                <UsersRoles />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/grn"
            element={
              <Layout>
                <GoodsReceipt />
              </Layout>
            }
          />
          <Route
            path="/transfer"
            element={
              <Layout>
                <StockTransfer />
              </Layout>
            }
          />
          <Route
            path="/pos-sale"
            element={
              <Layout>
                <POSSale />
              </Layout>
            }
          />
          <Route
            path="/stock-records"
            element={
              <Layout>
                <StockRecords />
              </Layout>
            }
          />
          <Route
            path="/inventory-reports"
            element={
              <Layout>
                <InventoryReports />
              </Layout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
