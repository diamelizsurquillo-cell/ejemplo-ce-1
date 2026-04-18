import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useFilters } from "@/context/FiltersContext";

export function DeliverySlaChart() {
  const { filteredOrders } = useFilters();

  const data = useMemo(() => {
    // Group by day for last N days, compute avg actual vs sla target
    const map = new Map<string, { actual: number[]; sla: number[] }>();
    filteredOrders.forEach((o) => {
      const d = new Date(o.date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (!map.has(key)) map.set(key, { actual: [], sla: [] });
      map.get(key)!.actual.push(o.actualHours);
      map.get(key)!.sla.push(o.slaHours);
    });
    return Array.from(map.entries())
      .map(([day, v]) => ({
        day,
        actual: +(v.actual.reduce((a, b) => a + b, 0) / v.actual.length).toFixed(1),
        sla: +(v.sla.reduce((a, b) => a + b, 0) / v.sla.length).toFixed(1),
      }))
      .sort((a, b) => {
        const [am, ad] = a.day.split("/").map(Number);
        const [bm, bd] = b.day.split("/").map(Number);
        return am === bm ? ad - bd : am - bm;
      })
      .slice(-30);
  }, [filteredOrders]);

  return (
    <div className="surface-card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">Tiempos de entrega vs SLA</h3>
          <p className="text-xs text-muted-foreground">Promedio de horas — actual vs objetivo</p>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line type="monotone" dataKey="sla" name="Objetivo SLA" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="actual" name="Tiempo real" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--accent))" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
