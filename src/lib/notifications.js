/**
 * Utilidad para notificaciones al administrador
 */

export async function notifyAdmin(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsStr = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatIdsStr) {
    console.error("Telegram credentials missing in .env");
    return;
  }

  const chatIds = chatIdsStr
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (chatIds.length === 0) {
    console.error("No valid Telegram Chat IDs found");
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
