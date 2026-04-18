import { incidents, orders } from "@/data/mockData";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFilters } from "@/context/FiltersContext";

const sevColor = {
  low: "hsl(var(--status-warning))",
  medium: "hsl(38 92% 45%)",
  high: "hsl(var(--status-danger))",
} as const;
const sevLabel = { low: "Baja", medium: "Media", high: "Alta" } as const;

export default function Incidents() {
  const { search } = useFilters();
  const orderMap = useMemo(() => Object.fromEntries(orders.map((o) => [o.id, o])), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return incidents;
    return incidents.filter((i) => {
      const o = orderMap[i.orderId];
      return (
        i.id.toLowerCase().includes(q) ||
        i.orderId.toLowerCase().includes(q) ||
        (o && o.customer.toLowerCase().includes(q))
      );
    });
  }, [search, orderMap]);

  const total = filtered.length;
  const resolved = filtered.filter((i) => i.resolved).length;
  const high = filtered.filter((i) => i.severity === "high").length;
  const resolutionRate = total ? ((resolved / total) * 100).toFixed(0) : "0";

  const byType = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach((i) => (m[i.type] = (m[i.type] ?? 0) + 1));
    return Object.entries(m).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
  }, [filtered]);

  const recent = [...filtered].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()).slice(0, 30);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="Incidencias totales" value={String(total)} icon={AlertTriangle} accent="warning" hint="reportadas" />
        <KpiCard index={1} label="Severidad alta" value={String(high)} delta={-3.2} icon={TrendingUp} accent="danger" />
        <KpiCard index={2} label="Resueltas" value={String(resolved)} delta={6.8} icon={CheckCircle2} accent="success" />
        <KpiCard index={3} label="Tasa de resolución" value={`${resolutionRate}%`} icon={Clock} accent="primary" hint="objetivo: 85%" />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-5">
        <div className="mb-4">
          <h3 className="font-display font-semibold text-lg">Causas principales</h3>
          <p className="text-xs text-muted-foreground">Distribución por tipo de incidencia</p>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer>
            <BarChart data={byType} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="surface-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold text-lg">Incidencias recientes</h3>
          <p className="text-xs text-muted-foreground">{recent.length} eventos más recientes</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Pedido</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Severidad</TableHead>
                <TableHead className="text-xs">Reportado</TableHead>
                <TableHead className="text-xs">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((i) => (
                <TableRow key={i.id} className="border-border hover:bg-secondary/40">
                  <TableCell className="font-mono text-xs font-semibold">{i.id}</TableCell>
                  <TableCell className="font-mono text-xs">{i.orderId}</TableCell>
                  <TableCell className="text-sm">{i.type}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${sevColor[i.severity]}20`, color: sevColor[i.severity] }}>
                      {sevLabel[i.severity]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(i.reportedAt).toLocaleDateString("es-MX")}</TableCell>
                  <TableCell>
                    {i.resolved ? (
                      <span className="text-xs text-status-success font-medium">✓ Resuelta</span>
                    ) : (
                      <span className="text-xs text-status-warning font-medium">● Abierta</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
