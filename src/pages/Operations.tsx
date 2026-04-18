import { useMemo, useState } from "react";
import { Package, Truck, Clock, DollarSign } from "lucide-react";
import { useFilters } from "@/context/FiltersContext";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RoutesMap } from "@/components/dashboard/RoutesMap";
import { DeliverySlaChart } from "@/components/dashboard/DeliverySlaChart";
import { CostStackedChart } from "@/components/dashboard/CostStackedChart";
import { OtdGauge } from "@/components/dashboard/OtdGauge";
import { DemandHeatmap } from "@/components/dashboard/DemandHeatmap";
import { ViewToggle } from "@/components/dashboard/ViewToggle";
import { OrdersList } from "@/components/dashboard/OrdersList";
import { OrdersCalendar } from "@/components/dashboard/OrdersCalendar";
import { ViewMode } from "@/data/mockData";

export default function Operations() {
  const { filteredOrders } = useFilters();
  const [view, setView] = useState<ViewMode>("map");

  const kpis = useMemo(() => {
    const total = filteredOrders.length;
    const delivered = filteredOrders.filter((o) => o.status === "delivered").length;
    const inTransit = filteredOrders.filter((o) => o.status === "in-transit").length;
    const issues = filteredOrders.filter((o) => o.status === "delayed" || o.status === "issue").length;
    const totalCost = filteredOrders.reduce((s, o) => s + o.cost, 0);
    const avgHours = total ? filteredOrders.reduce((s, o) => s + o.actualHours, 0) / total : 0;
    return { total, delivered, inTransit, issues, totalCost, avgHours };
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      <FiltersBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="Pedidos totales" value={kpis.total.toLocaleString()} delta={8.4} hint="vs período anterior" icon={Package} accent="primary" />
        <KpiCard index={1} label="En tránsito" value={kpis.inTransit.toLocaleString()} delta={-2.1} hint="ahora mismo" icon={Truck} accent="primary" />
        <KpiCard index={2} label="Tiempo promedio" value={`${kpis.avgHours.toFixed(1)}h`} delta={-4.7} hint="reducción de tiempo" icon={Clock} accent="success" />
        <KpiCard index={3} label="Costo total" value={`$${(kpis.totalCost / 1000).toFixed(1)}k`} delta={3.2} hint="MXN período" icon={DollarSign} accent="warning" />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display font-semibold text-xl">Vista operativa</h2>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === "map" && <RoutesMap />}
      {view === "list" && <OrdersList />}
      {view === "calendar" && <OrdersCalendar />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DeliverySlaChart />
        <CostStackedChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <OtdGauge />
        <div className="lg:col-span-2"><DemandHeatmap /></div>
      </div>
    </div>
  );
}
