import { Search, Bell, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useFilters } from "@/context/FiltersContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Operaciones", subtitle: "Vista global de la cadena de suministro en tiempo real" },
  "/flota": { title: "Flota & Conductores", subtitle: "Estado, utilización y desempeño de la flota" },
  "/incidencias": { title: "Incidencias y Retrasos", subtitle: "Análisis de eventos críticos y resolución" },
  "/reportes": { title: "Reportes", subtitle: "Exportación y vistas previas para stakeholders" },
};

export function AppHeader() {
  const { search, setSearch } = useFilters();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const meta = titleMap[pathname] ?? titleMap["/"];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="shrink-0" />
        <div className="hidden md:flex flex-col leading-tight pr-4 border-r border-border mr-2">
          <h1 className="font-display font-semibold text-base text-foreground">{meta.title}</h1>
          <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pedido o cliente…"
            className="pl-9 h-9 bg-secondary/50 border-border"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-danger animate-pulse-soft" />
          </button>
          <ThemeToggle />
          {/* Logout button */}
          <button
            id="logout-button"
            onClick={handleLogout}
            title={`Cerrar sesión (${user})`}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
