import { useContext } from "react";
import { PortfolioContext } from "../context/contexts";

export function usePortfolio() {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error("usePortfolio must be used within PortfolioProvider");
  return value;
}
