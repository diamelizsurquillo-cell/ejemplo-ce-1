import { drivers, getCarrier } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Users, Truck, Activity, Star } from "lucide-react";
import { motion } from "framer-motion";

const statusBadge = {
  active: { label: "Activo", color: "hsl(var(--status-success))" },
  rest: { label: "Descanso", color: "hsl(var(--status-warning))" },
  offline: { label: "Offline", color: "hsl(var(--muted-foreground))" },
} as const;

export default function Fleet() {
  const total = drivers.length;
  const active = drivers.filter((d) => d.status === "active").length;
  const avgRating = (drivers.reduce((s, d) => s + d.rating, 0) / total).toFixed(2);
  const totalKm = drivers.reduce((s, d) => s + d.kmThisMonth, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="Conductores totales" value={String(total)} icon={Users} accent="primary" hint="en operación" />
        <KpiCard index={1} label="Activos ahora" value={String(active)} delta={5.0} icon={Activity} accent="success" />
        <KpiCard index={2} label="Calificación prom." value={avgRating} icon={Star} accent="warning" hint="de 5.0" />
        <KpiCard index={3} label="Km recorridos" value={`${(totalKm / 1000).toFixed(1)}k`} delta={12.4} icon={Truck} accent="primary" hint="este mes" />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold text-lg">Roster de conductores</h3>
          <p className="text-xs text-muted-foreground">Estado en tiempo real y desempeño mensual</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Conductor</TableHead>
                <TableHead className="text-xs">Vehículo</TableHead>
                <TableHead className="text-xs">Placa</TableHead>
                <TableHead className="text-xs">Transportista</TableHead>
                <TableHead className="text-xs">Estado</TableHead>
                <TableHead className="text-xs text-right">Entregas</TableHead>
                <TableHead className="text-xs text-right">Km</TableHead>
                <TableHead className="text-xs text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => {
                const s = statusBadge[d.status];
                return (
                  <TableRow key={d.id} className="border-border hover:bg-secondary/40">
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="font-medium text-sm">{d.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.vehicle}</TableCell>
                    <TableCell className="font-mono text-xs">{d.plate}</TableCell>
                    <TableCell className="text-sm">{getCarrier(d.carrierId).name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${s.color}20`, color: s.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular text-sm">{d.deliveriesThisMonth}</TableCell>
                    <TableCell className="text-right tabular text-sm">{d.kmThisMonth.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 font-semibold tabular text-sm">
                        <Star className="h-3 w-3 fill-status-warning text-status-warning" />
                        {d.rating}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
