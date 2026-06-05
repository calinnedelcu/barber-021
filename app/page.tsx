import { getActiveClient, ACTIVE_SLUG } from "@/lib/clients";
import { DefaultSite } from "@/components/sites/DefaultSite";
import { AASite } from "@/components/sites/aa-barber/AASite";
import { MrMrsSite } from "@/components/sites/mr-mrs-style/MrMrsSite";
import { AndreiSite } from "@/components/sites/andrei-canciu/AndreiSite";

// Each lead gets a bespoke, on-brand site. Clients without one fall back to the
// shared DefaultSite composition.
export default function Home() {
  const config = getActiveClient();

  switch (ACTIVE_SLUG) {
    case "aa-barber":
      return <AASite config={config} />;
    case "mr-mrs-style":
      return <MrMrsSite config={config} />;
    case "andrei-canciu":
      return <AndreiSite config={config} />;
    default:
      return <DefaultSite config={config} />;
  }
}
