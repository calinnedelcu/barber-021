export interface WhatsAppDeeplinkArgs {
  phone: string;
  service?: string;
  date?: string;
  time?: string;
  customMessage?: string;
}

export function buildWhatsAppDeeplink({
  phone,
  service,
  date,
  time,
  customMessage,
}: WhatsAppDeeplinkArgs): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  let message = customMessage;
  if (!message) {
    const parts: string[] = ["Salut!"];
    if (service) parts.push(`Vreau o programare pentru ${service}`);
    if (date) parts.push(`pe ${date}`);
    if (time) parts.push(`la ora ${time}`);
    message = parts.join(" ") + ".";
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
