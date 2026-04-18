import { useFilters } from "@/context/FiltersContext";
import { getCarrier, getCenter, statusColor, statusLabel } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function OrdersList() {
  const { filteredOrders } = useFilters();
  const sample = filteredOrders.slice(0, 50);

  return (
    <div className="surface-card overflow-hidden">
      <div className="p-5 pb-3 flex items-baseline justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg">Pedidos recientes</h3>
          <p className="text-xs text-muted-foreground">{sample.length} de {filteredOrders.length} resultados</p>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[460px]">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow className="border-border">
              <TableHead className="text-xs">Pedido</TableHead>
              <TableHead className="text-xs">Cliente</TableHead>
              <TableHead className="text-xs">Origen → Destino</TableHead>
              <TableHead className="text-xs">Transportista</TableHead>
              <TableHead className="text-xs text-right">SLA</TableHead>
              <TableHead className="text-xs">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sample.map((o) => (
              <TableRow key={o.id} className="border-border hover:bg-secondary/50 cursor-pointer">
                <TableCell className="font-mono text-xs font-semibold">{o.id}</TableCell>
                <TableCell className="text-sm">{o.customer}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{getCenter(o.centerId).city} → {o.destination.city}</TableCell>
                <TableCell className="text-sm">{getCarrier(o.carrierId).name}</TableCell>
                <TableCell className="text-xs tabular text-right">{o.actualHours}h / {o.slaHours}h</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusColor[o.status]}20`, color: statusColor[o.status] }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[o.status] }} />
                    {statusLabel[o.status]}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
