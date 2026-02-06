"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ServiceId } from "@/data/services";

type SelectedServiceContextValue = {
  selectedServiceId: ServiceId | null;
  setSelectedServiceId: (id: ServiceId | null) => void;
};

const SelectedServiceContext = createContext<SelectedServiceContextValue | null>(
  null
);

export function SelectedServiceProvider({ children }: { children: ReactNode }) {
  const [selectedServiceId, setSelectedServiceIdState] =
    useState<ServiceId | null>(null);
  const setSelectedServiceId = useCallback((id: ServiceId | null) => {
    setSelectedServiceIdState(id);
  }, []);

  return (
    <SelectedServiceContext.Provider
      value={{ selectedServiceId, setSelectedServiceId }}
    >
      {children}
    </SelectedServiceContext.Provider>
  );
}

export function useSelectedService() {
  const ctx = useContext(SelectedServiceContext);
  if (!ctx)
    throw new Error(
      "useSelectedService must be used within SelectedServiceProvider"
    );
  return ctx;
}
