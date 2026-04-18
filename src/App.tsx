import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { FiltersProvider } from "@/context/FiltersContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Operations from "./pages/Operations";
import Fleet from "./pages/Fleet";
import Incidents from "./pages/Incidents";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FiltersProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Operations />} />
                <Route path="/flota" element={<Fleet />} />
                <Route path="/incidencias" element={<Incidents />} />
                <Route path="/reportes" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </FiltersProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
