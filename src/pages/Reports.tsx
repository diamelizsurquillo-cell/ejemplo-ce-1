import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useFilters } from "@/context/FiltersContext";
import { getCarrier, getCenter, statusLabel } from "@/data/mockData";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function Reports() {
  const { filteredOrders } = useFilters();

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Operaciones — LogiX", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generado: ${new Date().toLocaleString("es-MX")}  ·  ${filteredOrders.length} pedidos`, 14, 25);
    autoTable(doc, {
      startY: 32,
      head: [["Pedido", "Cliente", "Origen", "Destino", "Estado", "SLA(h)", "Real(h)", "Costo"]],
      body: filteredOrders.slice(0, 200).map((o) => [
        o.id, o.customer, getCenter(o.centerId).city, o.destination.city,
        statusLabel[o.status], o.slaHours, o.actualHours, `$${o.cost.toFixed(0)}`,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [45, 55, 72] },
    });
    doc.save(`reporte-logistica-${Date.now()}.pdf`);
    toast.success("PDF exportado correctamente");
  };

  const exportExcel = () => {
    const data = filteredOrders.map((o) => ({
      Pedido: o.id,
      Cliente: o.customer,
      Producto: o.productType,
      Region: o.region,
      Centro: getCenter(o.centerId).city,
      Transportista: getCarrier(o.carrierId).name,
      Estado: statusLabel[o.status],
      SLA_horas: o.slaHours,
      Tiempo_real: o.actualHours,
      Costo_MXN: o.cost,
      Peso_kg: o.weightKg,
      Fecha: new Date(o.date).toLocaleDateString("es-MX"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    XLSX.writeFile(wb, `reporte-logistica-${Date.now()}.xlsx`);
    toast.success("Excel exportado correctamente");
  };

  const reports = [
    { title: "Operaciones diarias", desc: "KPIs, OTD, costos y mapa de envíos del día.", count: filteredOrders.length },
    { title: "Análisis de incidencias", desc: "Eventos críticos, causas y resolución.", count: filteredOrders.filter((o) => o.status === "delayed" || o.status === "issue").length },
    { title: "Desempeño de flota", desc: "Utilización, kilometraje y rating.", count: 25 },
    { title: "Costos por CD", desc: "Desglose por categoría y centro.", count: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="surface-card p-6 bg-gradient-primary text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl">Centro de reportes</h2>
            <p className="text-primary-foreground/70 text-sm mt-1">Exporta datos consolidados en formato listo para stakeholders</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportPdf} variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" /> Exportar PDF
            </Button>
            <Button onClick={exportExcel} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <FileSpreadsheet className="h-4 w-4" /> Exportar Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="surface-card p-5 hover:shadow-elevated transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-base">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{r.count.toLocaleString()} registros</span>
              <Button size="sm" variant="ghost" onClick={exportPdf} className="text-accent hover:text-accent hover:bg-accent/10 gap-1.5">
                <Download className="h-3.5 w-3.5" /> Descargar
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
