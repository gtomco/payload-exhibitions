import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import { seedMainSite } from '@/endpoints/seed/mainSite'

async function main() {
  const force = process.argv.includes('--force')
  const payload = await getPayload({ config })
  await seedMainSite(payload, { force })
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
