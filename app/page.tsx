import { getActiveClient, ACTIVE_SLUG } from "@/lib/clients";
import { DefaultSite } from "@/components/sites/DefaultSite";
import { AASite } from "@/components/sites/aa-barber/AASite";
import { MrMrsSite } from "@/components/sites/mr-mrs-style/MrMrsSite";
import { AndreiSite } from "@/components/sites/andrei-canciu/AndreiSite";
import { NicoSite } from "@/components/sites/nico-beauty-style/NicoSite";
import { StartSite } from "@/components/sites/demo-start/StartSite";
import { BriciSite } from "@/components/sites/demo-custom/BriciSite";

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
    case "nico-beauty-style":
      return <NicoSite config={config} />;
    case "demo-start":
      return <StartSite config={config} />;
    case "demo-custom":
      return <BriciSite config={config} />;
    default:
      return <DefaultSite config={config} />;
  }
}
