/**
 * Fortrydelsesfunktionen på /fortryd (forbrugeraftaleloven § 20 a, gælder fra
 * 19. juni 2026, lov nr. 723 af 2025).
 *
 * Når en aftale er indgået online, skal kunden også kunne fortryde online: en
 * funktion mærket »Fortryd aftale«, en formular med navn, ordre og e-mail, en
 * knap mærket »Bekræft fortrydelse« og straks en kvittering på mail med det
 * indsendte og tidspunktet. Funktionen skal være let at finde, så den ligger i
 * footeren på alle sider.
 *
 * Sendes til den samme Apps Script-webapp som ordrer, med formType
 * "withdrawal". Kundens e-mail sendes med vilje som `email` og ikke som
 * `customerEmail`: en ældre version af scriptet uden fortrydelsesgrenen afviser
 * så kaldet i stedet for at oprette en ordre og sende en ordrebekræftelse.
 */

import { ORDER_ENDPOINT, ORDER_TOKEN } from "./orders";

/** Teksten på linket til /fortryd. Loven kræver denne eller en lige så tydelig tekst. */
export const WITHDRAWAL_LINK_LABEL = "Fortryd aftale";

/** Teksten på knappen, der sender fortrydelsen. Loven kræver denne eller en lige så tydelig tekst. */
export const WITHDRAWAL_BUTTON_LABEL = "Bekræft fortrydelse";

export interface WithdrawalPayload {
  name: string;
  email: string;
  /** Ordrenummer fra ordrebekræftelsen (fx ORD-215) eller datoen for bestillingen. */
  orderRef: string;
  /** Hvilke varer der fortrydes. Tom betyder hele ordren. */
  items: string;
  /** Honeypot: tom for mennesker, udfyldt af bots. */
  botField: string;
}

export interface WithdrawalResult {
  /** Tidspunktet, scriptet modtog fortrydelsen, i dansk tid, fx "29.09.2026 kl. 10:45:12". */
  receivedAt: string;
}

export async function submitWithdrawal(payload: WithdrawalPayload): Promise<WithdrawalResult> {
  const response = await fetch(ORDER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      token: ORDER_TOKEN,
      formType: "withdrawal",
      botField: payload.botField,
      name: payload.name,
      email: payload.email,
      orderRef: payload.orderRef,
      items: payload.items,
      submittedAt: new Date().toISOString(),
    }),
  });

  const text = await response.text();
  let data: { success?: boolean; receivedAt?: string } | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as { success?: boolean; receivedAt?: string };
    } catch {
      // Ugyldig JSON: behandles som en fejl herunder.
    }
  }

  // Uden `receivedAt` er der ingen bekræftelse på, at kvitteringen er sendt.
  if (!response.ok || data?.success !== true || !data.receivedAt) {
    throw new Error("Fortrydelsen blev ikke sendt.");
  }

  return { receivedAt: data.receivedAt };
}
