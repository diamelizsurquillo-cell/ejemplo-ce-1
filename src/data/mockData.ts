// Generador determinista de 500 pedidos + flota + incidencias para LATAM/MX

export type OrderStatus = "delivered" | "in-transit" | "delayed" | "issue";
export type ViewMode = "map" | "list" | "calendar";

export interface DistributionCenter {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export interface Carrier {
  id: string;
  name: string;
  color: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  carrierId: string;
  status: "active" | "rest" | "offline";
  rating: number;
  deliveriesThisMonth: number;
  kmThisMonth: number;
}

export interface Order {
  id: string;
  customer: string;
  productType: string;
  region: string;
  centerId: string;
  carrierId: string;
  driverId: string;
  status: OrderStatus;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number; city: string };
  cost: number;
  slaHours: number;
  actualHours: number;
  date: string; // ISO
  weightKg: number;
}

export interface Incident {
  id: string;
  orderId: string;
  type: "Tráfico" | "Mecánico" | "Clima" | "Dirección errónea" | "Daño en producto";
  severity: "low" | "medium" | "high";
  description: string;
  reportedAt: string;
  resolved: boolean;
}

// Seeded RNG (mulberry32)
function makeRng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = makeRng(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const between = (min: number, max: number) => min + rng() * (max - min);
const intBetween = (min: number, max: number) => Math.floor(between(min, max + 1));

export const distributionCenters: DistributionCenter[] = [
  { id: "CD-MEX", name: "CD Ciudad de México", city: "CDMX", lat: 19.4326, lng: -99.1332 },
  { id: "CD-MTY", name: "CD Monterrey", city: "Monterrey", lat: 25.6866, lng: -100.3161 },
  { id: "CD-GDL", name: "CD Guadalajara", city: "Guadalajara", lat: 20.6597, lng: -103.3496 },
  { id: "CD-PUE", name: "CD Puebla", city: "Puebla", lat: 19.0414, lng: -98.2063 },
  { id: "CD-MID", name: "CD Mérida", city: "Mérida", lat: 20.9674, lng: -89.5926 },
];

export const carriers: Carrier[] = [
  { id: "C-01", name: "Estafeta Express", color: "hsl(var(--chart-2))" },
  { id: "C-02", name: "Paquetería Norte", color: "hsl(var(--chart-3))" },
  { id: "C-03", name: "RutaPlus", color: "hsl(var(--chart-4))" },
  { id: "C-04", name: "TransLogix", color: "hsl(var(--chart-5))" },
];

export const regions = ["Norte", "Centro", "Occidente", "Sur", "Sureste", "Bajío"] as const;

const productTypes = [
  "Electrónica", "Refrigerado", "Frágil", "Voluminoso", "Documentos", "Textil", "Alimentos", "Farmacéutico",
];

const firstNames = ["María", "Juan", "Ana", "Luis", "Carmen", "Carlos", "Sofía", "Pedro", "Lucía", "Diego", "Valentina", "Andrés", "Camila", "Roberto", "Daniela", "Fernando"];
const lastNames = ["García", "Hernández", "López", "Martínez", "Rodríguez", "Sánchez", "Pérez", "Gómez", "Torres", "Ramírez", "Flores", "Cruz", "Reyes", "Morales"];
const companies = ["Soluciones SA", "Comercial MX", "Distribuidora Central", "Grupo Industrial", "Norte Logístico", "Importadora Premium", "Servicios Globales", "Comercializadora del Pacífico"];

const cities: { name: string; region: string; lat: number; lng: number }[] = [
  { name: "CDMX", region: "Centro", lat: 19.4326, lng: -99.1332 },
  { name: "Monterrey", region: "Norte", lat: 25.6866, lng: -100.3161 },
  { name: "Guadalajara", region: "Occidente", lat: 20.6597, lng: -103.3496 },
  { name: "Puebla", region: "Centro", lat: 19.0414, lng: -98.2063 },
  { name: "Tijuana", region: "Norte", lat: 32.5149, lng: -117.0382 },
  { name: "León", region: "Bajío", lat: 21.1250, lng: -101.6859 },
  { name: "Querétaro", region: "Bajío", lat: 20.5888, lng: -100.3899 },
  { name: "Mérida", region: "Sureste", lat: 20.9674, lng: -89.5926 },
  { name: "Cancún", region: "Sureste", lat: 21.1619, lng: -86.8515 },
  { name: "Veracruz", region: "Sureste", lat: 19.1738, lng: -96.1342 },
  { name: "Toluca", region: "Centro", lat: 19.2826, lng: -99.6557 },
  { name: "Chihuahua", region: "Norte", lat: 28.6353, lng: -106.0889 },
  { name: "Aguascalientes", region: "Bajío", lat: 21.8853, lng: -102.2916 },
  { name: "Oaxaca", region: "Sur", lat: 17.0732, lng: -96.7266 },
  { name: "Acapulco", region: "Sur", lat: 16.8531, lng: -99.8237 },
  { name: "Saltillo", region: "Norte", lat: 25.4232, lng: -101.0053 },
  { name: "Hermosillo", region: "Norte", lat: 29.0729, lng: -110.9559 },
  { name: "Mazatlán", region: "Occidente", lat: 23.2494, lng: -106.4111 },
];

export const drivers: Driver[] = Array.from({ length: 25 }, (_, i) => {
  const carrier = pick(carriers);
  return {
    id: `DR-${String(i + 1).padStart(3, "0")}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    vehicle: pick(["Camión 3.5T", "Van Sprinter", "Camión 7.5T", "Camioneta 1.5T", "Tráiler 22T"]),
    plate: `${String.fromCharCode(65 + intBetween(0, 25))}${String.fromCharCode(65 + intBetween(0, 25))}${String.fromCharCode(65 + intBetween(0, 25))}-${intBetween(100, 999)}`,
    carrierId: carrier.id,
    status: pick(["active", "active", "active", "rest", "offline"]),
    rating: parseFloat(between(3.8, 5.0).toFixed(1)),
    deliveriesThisMonth: intBetween(40, 180),
    kmThisMonth: intBetween(1500, 9000),
  };
});

function generateOrders(): Order[] {
  const orders: Order[] = [];
  const now = new Date();
  for (let i = 0; i < 500; i++) {
    const center = pick(distributionCenters);
    const dest = pick(cities);
    const carrier = pick(carriers);
    const driver = drivers[intBetween(0, drivers.length - 1)];
    // Status distribution: ~70% delivered, 18% in-transit, 8% delayed, 4% issue
    const r = rng();
    const status: OrderStatus = r < 0.7 ? "delivered" : r < 0.88 ? "in-transit" : r < 0.96 ? "delayed" : "issue";
    const slaHours = intBetween(24, 120);
    const actualHours = status === "delivered"
      ? intBetween(Math.max(8, slaHours - 30), slaHours - 1)
      : status === "in-transit"
      ? intBetween(4, slaHours - 5)
      : intBetween(slaHours + 2, slaHours + 48);

    const customer = rng() > 0.55 ? `${pick(firstNames)} ${pick(lastNames)}` : pick(companies);
    const daysAgo = intBetween(0, 90);
    const date = new Date(now.getTime() - daysAgo * 86400000);

    orders.push({
      id: `ORD-${String(10000 + i).padStart(5, "0")}`,
      customer,
      productType: pick(productTypes),
      region: dest.region,
      centerId: center.id,
      carrierId: carrier.id,
      driverId: driver.id,
      status,
      origin: { lat: center.lat, lng: center.lng },
      destination: { lat: dest.lat + between(-0.05, 0.05), lng: dest.lng + between(-0.05, 0.05), city: dest.name },
      cost: parseFloat(between(280, 4800).toFixed(2)),
      slaHours,
      actualHours,
      date: date.toISOString(),
      weightKg: parseFloat(between(0.5, 220).toFixed(1)),
    });
  }
  return orders;
}

export const orders: Order[] = generateOrders();

const incidentTypes: Incident["type"][] = ["Tráfico", "Mecánico", "Clima", "Dirección errónea", "Daño en producto"];
export const incidents: Incident[] = orders
  .filter((o) => o.status === "delayed" || o.status === "issue")
  .map((o, idx) => ({
    id: `INC-${String(idx + 1).padStart(4, "0")}`,
    orderId: o.id,
    type: pick(incidentTypes),
    severity: o.status === "issue" ? (pick(["medium", "high", "high"]) as "medium" | "high") : (pick(["low", "low", "medium"]) as "low" | "medium"),
    description: o.status === "issue"
      ? "Incidencia crítica reportada por el conductor"
      : "Retraso por condiciones operativas",
    reportedAt: o.date,
    resolved: rng() > 0.4,
  }));

// Helpers
export const getCenter = (id: string) => distributionCenters.find((c) => c.id === id)!;
export const getCarrier = (id: string) => carriers.find((c) => c.id === id)!;
export const getDriver = (id: string) => drivers.find((d) => d.id === id)!;

export const statusLabel: Record<OrderStatus, string> = {
  delivered: "Entregado",
  "in-transit": "En tránsito",
  delayed: "Retrasado",
  issue: "Incidencia",
};

export const statusColor: Record<OrderStatus, string> = {
  delivered: "hsl(var(--status-success))",
  "in-transit": "hsl(var(--status-info))",
  delayed: "hsl(var(--status-warning))",
  issue: "hsl(var(--status-danger))",
};
