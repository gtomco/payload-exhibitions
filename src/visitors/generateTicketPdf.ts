import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import PDFDocument from 'pdfkit'

import { generateQrPngBuffer } from './generateQrPng'

export type TicketPdfInput = {
  firstName: string
  lastName: string
  company?: string | null
  eventTitle: string
  eventDates: string
  eventLocation: string
  ticketToken: string
  qrPayload: string
  theme: {
    primary: string
    secondary: string
    dark: string
  }
  logoPath?: string | null
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '').trim()
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized.slice(0, 6)
  const value = Number.parseInt(expanded || '161F5E', 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

async function resolveLogoBuffer(logoPath?: string | null): Promise<Buffer | null> {
  if (!logoPath) return null
  try {
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      const res = await fetch(logoPath)
      if (!res.ok) return null
      return Buffer.from(await res.arrayBuffer())
    }

    const filename = fileURLToPath(import.meta.url)
    const dirname = path.dirname(filename)
    const publicRoot = path.resolve(dirname, '../../public')
    const absolute = logoPath.startsWith('/')
      ? path.join(publicRoot, logoPath.replace(/^\//, ''))
      : path.resolve(logoPath)
    return await fs.readFile(absolute)
  } catch {
    return null
  }
}

export async function generateTicketPdf(input: TicketPdfInput): Promise<Buffer> {
  const qrBuffer = await generateQrPngBuffer(input.qrPayload)
  const logoBuffer = await resolveLogoBuffer(input.logoPath)
  const dark = hexToRgb(input.theme.dark)
  const primary = hexToRgb(input.theme.primary)
  const secondary = hexToRgb(input.theme.secondary)

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 0,
  })

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  const pageW = doc.page.width
  const pageH = doc.page.height

  // Left brand panel
  doc.rect(0, 0, pageW * 0.38, pageH).fill(dark)
  doc.rect(0, pageH - 18, pageW * 0.38, 18).fill(primary)
  doc.rect(0, 0, 10, pageH).fill(secondary)

  if (logoBuffer) {
    try {
      doc.image(logoBuffer, 40, 40, { fit: [180, 70] })
    } catch {
      // ignore invalid logo formats
    }
  }

  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(28)
    .text('VISITOR TICKET', 40, logoBuffer ? 130 : 60, { width: pageW * 0.38 - 60 })

  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor('#d4d4d8')
    .text(input.eventTitle, 40, logoBuffer ? 180 : 110, { width: pageW * 0.38 - 60 })

  // Right content
  const rightX = pageW * 0.38 + 40
  const rightW = pageW * 0.62 - 80

  doc.fillColor(dark).font('Helvetica-Bold').fontSize(32)
  doc.text(`${input.firstName} ${input.lastName}`.trim(), rightX, 50, { width: rightW })

  if (input.company) {
    doc.font('Helvetica').fontSize(14).fillColor('#52525b')
    doc.text(input.company, rightX, 95, { width: rightW })
  }

  const detailsY = input.company ? 140 : 120
  doc.font('Helvetica-Bold').fontSize(11).fillColor(primary)
  doc.text('EVENT', rightX, detailsY)
  doc.font('Helvetica').fontSize(14).fillColor('#18181b')
  doc.text(input.eventTitle, rightX, detailsY + 16, { width: rightW * 0.55 })

  doc.font('Helvetica-Bold').fontSize(11).fillColor(primary)
  doc.text('DATES', rightX, detailsY + 70)
  doc.font('Helvetica').fontSize(14).fillColor('#18181b')
  doc.text(input.eventDates || '—', rightX, detailsY + 86, { width: rightW * 0.55 })

  doc.font('Helvetica-Bold').fontSize(11).fillColor(primary)
  doc.text('LOCATION', rightX, detailsY + 130)
  doc.font('Helvetica').fontSize(14).fillColor('#18181b')
  doc.text(input.eventLocation || '—', rightX, detailsY + 146, { width: rightW * 0.55 })

  const qrSize = 160
  const qrX = pageW - qrSize - 50
  const qrY = pageH - qrSize - 70
  doc.roundedRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 40, 8).strokeColor(primary).lineWidth(2).stroke()
  doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize })
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor('#52525b')
    .text('Show at entrance', qrX - 12, qrY + qrSize + 6, { width: qrSize + 24, align: 'center' })

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#a1a1aa')
    .text(`Ticket ${input.ticketToken.slice(0, 8).toUpperCase()}`, rightX, pageH - 40)

  doc.end()
  return done
}
