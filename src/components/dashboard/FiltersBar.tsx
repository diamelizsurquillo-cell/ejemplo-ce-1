import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/FiltersContext";
import { carriers, regions } from "@/data/mockData";
import { RotateCcw } from "lucide-react";

const productTypes = ["Electrónica", "Refrigerado", "Frágil", "Voluminoso", "Documentos", "Textil", "Alimentos", "Farmacéutico"];

export function FiltersBar() {
  const { region, setRegion, carrierId, setCarrierId, productType, setProductType, daysBack, setDaysBack, reset } = useFilters();

  return (
    <div className="surface-card p-4 flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mr-1">Filtros</span>

      <Select value={String(daysBack)} onValueChange={(v) => setDaysBack(Number(v))}>
        <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 días</SelectItem>
          <SelectItem value="30">Últimos 30 días</SelectItem>
          <SelectItem value="60">Últimos 60 días</SelectItem>
          <SelectItem value="90">Últimos 90 días</SelectItem>
        </SelectContent>
      </Select>

      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Región" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las regiones</SelectItem>
          {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={carrierId} onValueChange={setCarrierId}>
        <SelectTrigger className="h-9 w-[170px]"><SelectValue placeholder="Transportista" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los transportistas</SelectItem>
          {carriers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={productType} onValueChange={setProductType}>
        <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Producto" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los productos</SelectItem>
          {productTypes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={reset} className="ml-auto text-muted-foreground hover:text-foreground">
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Limpiar
      </Button>
    </div>
  );
}
