/**
 * Utilidad para notificaciones al administrador
 */

export async function notifyAdmin(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  // Buscar todos los IDs en variables que empiecen por TELEGRAM_CHAT_ID
  const chatIds = Object.keys(process.env)
    .filter((key) => key.startsWith("TELEGRAM_CHAT_ID"))
    .flatMap((key) => (process.env[key] || "").split(","))
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    console.error("Telegram credentials missing or no valid Chat IDs found");
    return;
  }

  const {
    type = "nueva_compra",
    cliente,
    cantidad,
    monto,
    metodo,
    rifa,
    folio,
    referencia,
    comprobante_url,
  } = data;

  let message = "";

  if (type === "nueva_compra") {
    message = `
<b>🎟️ NUEVA RESERVA RECIBIDA 🎟️</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Cliente:</b> ${cliente}
🏷️ <b>Rifa:</b> ${rifa}
🔢 <b>Cantidad:</b> ${cantidad} boletos
💰 <b>Monto:</b> ${monto.toLocaleString()} BS
💳 <b>Método:</b> ${metodo.toUpperCase().replace(/_/g, " ")}
📄 <b>Folio:</b> <code>${folio}</code>
🔗 <b>Ref:</b> ${referencia || "No enviada"}
━━━━━━━━━━━━━━━━━━━━
Check el Dashboard para validar el pago.
    `.trim();
  } else if (type === "test") {
    message = `
<b>🚀 MENSAJE DE PRUEBA 🚀</b>
━━━━━━━━━━━━━━━━━━━━
Si estás viendo esto, tu bot de Telegram está correctamente vinculado con <b>Gana con el Gocho</b>.
    `.trim();
  }

  // Send to all Chat IDs
  for (const chatId of chatIds) {
    try {
      const isPhoto = !!comprobante_url;
      const method = isPhoto ? "sendPhoto" : "sendMessage";
      const url = `https://api.telegram.org/bot${token}/${method}`;

      const payload = {
        chat_id: chatId,
        parse_mode: "HTML",
      };

      if (isPhoto) {
        payload.photo = comprobante_url;
        payload.caption = message;
      } else {
        payload.text = message;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Telegram API Error for ID ${chatId}:`, errorData);
      }
    } catch (error) {
      console.error(`Error sending Telegram message to ID ${chatId}:`, error);
    }
  }
}
