declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      /** Apex domain, e.g. i-exhibitions.com — microsites use {slug}.{ROOT_DOMAIN} */
      ROOT_DOMAIN?: string
      /** http | https — used when building public origins from ROOT_DOMAIN */
      PUBLIC_PROTOCOL?: string
      /** Prefer X-Forwarded-Host / Proto (set behind Caddy/Traefik) */
      TRUST_PROXY?: string
      /** true|false — allow /m/{slug} path microsites (default: true outside production) */
      ENABLE_PATH_MICROSITES?: string
      CRM_API_URL?: string
      CRM_ASSETS_URL?: string
      /** SMTP outbound mail (visitor tickets, form emails) */
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_USER?: string
      SMTP_PASS?: string
      SMTP_FROM_ADDRESS?: string
      SMTP_FROM_NAME?: string
      SMTP_SECURE?: string
      SMTP_SKIP_VERIFY?: string
    }
  }
}

export {}
