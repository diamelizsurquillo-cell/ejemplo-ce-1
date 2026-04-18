import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useFilters } from "@/context/FiltersContext";
import { distributionCenters, getCenter } from "@/data/mockData";

const categories = ["Combustible", "Personal", "Mantenimiento", "Empaque"];

export function CostStackedChart() {
  const { filteredOrders } = useFilters();

  const data = useMemo(() => {
    const totals = new Map<string, number>();
    filteredOrders.forEach((o) => totals.set(o.centerId, (totals.get(o.centerId) ?? 0) + o.cost));
    return distributionCenters.map((cd) => {
      const total = totals.get(cd.id) ?? 0;
      return {
        center: getCenter(cd.id).city,
        Combustible: +(total * 0.42).toFixed(0),
        Personal: +(total * 0.31).toFixed(0),
        Mantenimiento: +(total * 0.16).toFixed(0),
        Empaque: +(total * 0.11).toFixed(0),
      };
    });
  }, [filteredOrders]);

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-4))", "hsl(var(--chart-3))"];

  return (
    <div className="surface-card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">Costos por centro de distribución</h3>
          <p className="text-xs text-muted-foreground">Desglose por categoría operativa (MXN)</p>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="center" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => `$${v.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {categories.map((c, i) => (
              <Bar key={c} dataKey={c} stackId="costs" fill={colors[i]} radius={i === categories.length - 1 ? [4, 4, 0, 0] : 0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
