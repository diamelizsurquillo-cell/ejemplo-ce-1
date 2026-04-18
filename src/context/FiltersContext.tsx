import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { orders as allOrders, Order } from "@/data/mockData";

interface Filters {
  region: string;
  carrierId: string;
  productType: string;
  search: string;
  daysBack: number;
}

interface FiltersCtx extends Filters {
  setRegion: (v: string) => void;
  setCarrierId: (v: string) => void;
  setProductType: (v: string) => void;
  setSearch: (v: string) => void;
  setDaysBack: (v: number) => void;
  reset: () => void;
  filteredOrders: Order[];
}

const defaultFilters: Filters = {
  region: "all",
  carrierId: "all",
  productType: "all",
  search: "",
  daysBack: 30,
};

const FiltersContext = createContext<FiltersCtx | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState(defaultFilters.region);
  const [carrierId, setCarrierId] = useState(defaultFilters.carrierId);
  const [productType, setProductType] = useState(defaultFilters.productType);
  const [search, setSearch] = useState(defaultFilters.search);
  const [daysBack, setDaysBack] = useState(defaultFilters.daysBack);

  const filteredOrders = useMemo(() => {
    const cutoff = Date.now() - daysBack * 86400000;
    const q = search.trim().toLowerCase();
    return allOrders.filter((o) => {
      if (region !== "all" && o.region !== region) return false;
      if (carrierId !== "all" && o.carrierId !== carrierId) return false;
      if (productType !== "all" && o.productType !== productType) return false;
      if (new Date(o.date).getTime() < cutoff) return false;
      if (q && !o.id.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [region, carrierId, productType, search, daysBack]);

  return (
    <FiltersContext.Provider
      value={{
        region, carrierId, productType, search, daysBack,
        setRegion, setCarrierId, setProductType, setSearch, setDaysBack,
        reset: () => {
          setRegion(defaultFilters.region);
          setCarrierId(defaultFilters.carrierId);
          setProductType(defaultFilters.productType);
          setSearch(defaultFilters.search);
          setDaysBack(defaultFilters.daysBack);
        },
        filteredOrders,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}
