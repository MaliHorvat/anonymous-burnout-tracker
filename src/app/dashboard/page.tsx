import { DashboardView } from "@/components/DashboardView";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";

export const metadata = {
  title: "Nadzorna plošča | Burnout Tracker",
};

export default async function DashboardPage() {
  const authed = await isDashboardAuthenticated();
  return <DashboardView initialAuthed={authed} />;
}
