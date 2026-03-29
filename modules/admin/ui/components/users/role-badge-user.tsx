import { Badge } from "@/components/ui/badge";
export default function UserRoleBadge({ role }: { role: string }) {
  const color = {
    superadmin: "bg-red-500", // kuat, dominan
    admin: "bg-blue-500", // stabil, terpercaya
    cashier: "bg-green-500", // identik uang/transaksi
    warehouse: "bg-orange-500", // logistik, energi kerja
    finance: "bg-purple-500", // profesional & eksklusif
    user: "bg-gray-500", // netral
  };
  return <Badge className={color[role as keyof typeof color]} >{role.toUpperCase()}</Badge>;
}
