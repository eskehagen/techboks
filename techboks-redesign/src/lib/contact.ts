/**
 * Contact form submission layer.
 *
 * Submits to a dedicated Google Apps Script endpoint (separate deployment
 * from the order script in orders.ts) which emails the shop owner directly.
 */

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** Honeypot field — left empty by humans, filled in by bots. */
  botField: string;
}

export interface ContactResult {
  ok: boolean;
}

const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT ?? "";

function buildPayload(payload: ContactPayload) {
  return {
    token: "TB-2946-CONTACT-773",
    botField: payload.botField,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    subject: payload.subject,
    message: payload.message,
    timestamp: new Date().toISOString(),
  };
}

export async function submitContactMessage(payload: ContactPayload): Promise<ContactResult> {
  if (!contactEndpoint) {
    throw new Error("Kontaktformularen er ikke sat op endnu. Skriv til info@techboks.dk i stedet.");
  }

  const response = await fetch(contactEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(buildPayload(payload)),
  });

  const text = await response.text();
  let data: { success?: boolean; error?: string } | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as { success?: boolean; error?: string };
    } catch {
      // Ignore invalid JSON and rely on the HTTP status.
    }
  }

  if (!response.ok || data?.success !== true) {
    throw new Error(data?.error ?? "Kunne ikke sende beskeden. Prøv igen senere.");
  }

  return { ok: true };
}
