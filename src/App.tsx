
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Maintenance from "./pages/Maintenance";
import Inventory from "./pages/Inventory";
import Employees from "./pages/Employees";
import Repairs from "./pages/Repairs";
import NotFound from "./pages/NotFound";

// Import remaining pages that will be implemented
import Invoices from "./pages/Invoices";
import Warranty from "./pages/Warranty";
import RepairHistory from "./pages/RepairHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="devices" element={<Devices />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="employees" element={<Employees />} />
            <Route path="repairs" element={<Repairs />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="warranty" element={<Warranty />} />
            <Route path="repair-history" element={<RepairHistory />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
