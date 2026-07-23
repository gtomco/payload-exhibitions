import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import { seedEcgeMicrosite } from '@/endpoints/seed/ecgeMicrosite'

async function main() {
  const payload = await getPayload({ config })
  await seedEcgeMicrosite(payload)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
