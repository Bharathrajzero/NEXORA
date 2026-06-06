import { DashboardClient } from "@/components/nexora/dashboard-client";

export default function DashboardPage() {
  const guestUser = {
    id: "guest",
    email: "guest@nexora.local",
    username: "guest"
  };

  return <DashboardClient user={guestUser} />;
}
