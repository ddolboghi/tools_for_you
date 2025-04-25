export const runtime = "edge";

import SaleCalculation from "@/components/sale/SaleCalculation";
import "./style.css";

export default function page() {
  return (
    <main className="app-container">
      <SaleCalculation />
    </main>
  );
}
