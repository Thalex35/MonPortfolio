import { useContext } from "react";
import { AuthContext } from "../context/contexts";

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth must be used within AuthProvider");
  return value;
}
