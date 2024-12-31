import SaleCalculation from "@/components/sale/SaleCalculation";
import AlarmPopUp from "@/components/ui/AlarmPopUp";

export default function page() {
  return (
    <main>
      <AlarmPopUp />
      <SaleCalculation />
      <footer className="text-center text-sm text-[#9ca1a7] py-2 bg-[#F6F8FA]">
        문의: jhasd128@gmail.com
      </footer>
    </main>
  );
}
