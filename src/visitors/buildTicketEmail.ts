type TicketEmailArgs = {
  firstName: string
  eventTitle: string
  eventDates: string
  eventLocation: string
  qrImageUrl: string
  brandName: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildTicketEmailHtml(args: TicketEmailArgs): string {
  const firstName = escapeHtml(args.firstName)
  const eventTitle = escapeHtml(args.eventTitle)
  const eventDates = escapeHtml(args.eventDates || '—')
  const eventLocation = escapeHtml(args.eventLocation || '—')
  const brandName = escapeHtml(args.brandName)
  const qrImageUrl = escapeHtml(args.qrImageUrl)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,serif;color:#111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:32px 28px 8px;">
          <p style="margin:0 0 8px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#666;">${brandName}</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:700;">Hello ${firstName},</h1>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.5;color:#333;">
            Thank you for registering for <strong>${eventTitle}</strong>. Your visitor ticket is ready.
          </p>
        </td></tr>
        <tr><td style="padding:0 28px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px;">
            <tr>
              <td style="padding:10px 12px;border:1px solid #e4e4e7;background:#fafafa;width:34%;color:#555;">Fair</td>
              <td style="padding:10px 12px;border:1px solid #e4e4e7;font-weight:600;">${eventTitle}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;border:1px solid #e4e4e7;background:#fafafa;color:#555;">Dates</td>
              <td style="padding:10px 12px;border:1px solid #e4e4e7;">${eventDates}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;border:1px solid #e4e4e7;background:#fafafa;color:#555;">Location</td>
              <td style="padding:10px 12px;border:1px solid #e4e4e7;">${eventLocation}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:8px 28px 32px;text-align:center;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#333;">
            Show this QR code at the entrance. Keep this email handy — staff will scan it to verify your registration.
          </p>
          <img src="${qrImageUrl}" alt="Your entrance QR code" width="220" height="220" style="display:block;margin:0 auto;border:0;" />
          <p style="margin:16px 0 0;font-size:13px;color:#777;">A PDF ticket is attached for offline use.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function buildTicketEmailText(args: TicketEmailArgs): string {
  return [
    `Hello ${args.firstName},`,
    '',
    `Thank you for registering for ${args.eventTitle}.`,
    '',
    `Fair: ${args.eventTitle}`,
    `Dates: ${args.eventDates || '—'}`,
    `Location: ${args.eventLocation || '—'}`,
    '',
    'Show the QR code in this email (or the attached PDF) at the entrance.',
    `QR image: ${args.qrImageUrl}`,
  ].join('\n')
}
