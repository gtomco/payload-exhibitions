import QRCode from 'qrcode'

export async function generateQrPngBuffer(payload: string): Promise<Buffer> {
  return QRCode.toBuffer(payload, {
    type: 'png',
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#111111',
      light: '#ffffff',
    },
  })
}
