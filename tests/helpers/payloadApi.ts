import type { APIRequestContext } from '@playwright/test'
import { expect } from '@playwright/test'

import { ACTIVE_MICROSITE_HEADER } from '../../src/microsite/constants'

export type PayloadLoginResult = {
  token: string
  user: { id: string | number; email: string }
}

export class PayloadApiClient {
  private token: string | null = null

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  get authHeaders(): Record<string, string> {
    if (!this.token) throw new Error('Not authenticated — call login() first')
    return { Authorization: `JWT ${this.token}` }
  }

  contextHeaders(micrositeId?: string | number): Record<string, string> {
    if (!micrositeId) return this.authHeaders
    return {
      ...this.authHeaders,
      [ACTIVE_MICROSITE_HEADER]: String(micrositeId),
    }
  }

  async login(email: string, password: string): Promise<PayloadLoginResult> {
    const response = await this.request.post(`${this.baseURL}/api/users/login`, {
      data: { email, password },
    })
    expect(response.ok(), `login failed: ${response.status()} ${await response.text()}`).toBeTruthy()
    const body = (await response.json()) as PayloadLoginResult
    expect(body.token).toBeTruthy()
    this.token = body.token
    return body
  }

  async me() {
    const response = await this.request.get(`${this.baseURL}/api/users/me`, {
      headers: this.authHeaders,
    })
    expect(response.ok(), await response.text()).toBeTruthy()
    return response.json()
  }

  async find<T = unknown>(
    collection: string,
    query: Record<string, string> = {},
    micrositeId?: string | number,
  ) {
    const params = new URLSearchParams(query)
    const response = await this.request.get(`${this.baseURL}/api/${collection}?${params}`, {
      headers: this.contextHeaders(micrositeId),
    })
    expect(response.ok(), `${collection} find failed: ${await response.text()}`).toBeTruthy()
    return response.json() as Promise<{ docs: T[]; totalDocs: number }>
  }

  async findPublic<T = unknown>(collection: string, query: Record<string, string> = {}) {
    const params = new URLSearchParams(query)
    const response = await this.request.get(`${this.baseURL}/api/${collection}?${params}`)
    expect(response.ok(), `${collection} public find failed: ${await response.text()}`).toBeTruthy()
    return response.json() as Promise<{ docs: T[]; totalDocs: number }>
  }

  async get<T = unknown>(collection: string, id: string | number, draft = false) {
    const suffix = draft ? '?draft=true' : ''
    const response = await this.request.get(`${this.baseURL}/api/${collection}/${id}${suffix}`, {
      headers: this.authHeaders,
    })
    expect(response.ok(), `${collection}/${id} get failed: ${await response.text()}`).toBeTruthy()
    return response.json() as Promise<T>
  }

  async create<T = unknown>(
    collection: string,
    data: Record<string, unknown>,
    draft = false,
    micrositeId?: string | number,
  ) {
    return this.createWithContext(collection, data, draft, micrositeId)
  }

  async createWithContext<T = unknown>(
    collection: string,
    data: Record<string, unknown>,
    draft = false,
    micrositeId?: string | number,
  ) {
    const suffix = draft ? '?draft=true' : ''
    const response = await this.request.post(`${this.baseURL}/api/${collection}${suffix}`, {
      headers: { ...this.contextHeaders(micrositeId), 'Content-Type': 'application/json' },
      data,
    })
    expect(
      response.ok(),
      `${collection} create failed: ${response.status()} ${await response.text()}`,
    ).toBeTruthy()
    return response.json() as Promise<T & { id: string | number; doc?: T & { id: string | number } }>
  }

  async update<T = unknown>(
    collection: string,
    id: string | number,
    data: Record<string, unknown>,
    draft = false,
  ) {
    const suffix = draft ? '?draft=true' : ''
    const response = await this.request.patch(`${this.baseURL}/api/${collection}/${id}${suffix}`, {
      headers: { ...this.authHeaders, 'Content-Type': 'application/json' },
      data,
    })
    expect(
      response.ok(),
      `${collection}/${id} update failed: ${response.status()} ${await response.text()}`,
    ).toBeTruthy()
    return response.json() as Promise<T & { id: string | number; doc?: T & { id: string | number } }>
  }

  async delete(collection: string, id: string | number) {
    const response = await this.request.delete(`${this.baseURL}/api/${collection}/${id}`, {
      headers: this.authHeaders,
    })
    expect(
      response.ok(),
      `${collection}/${id} delete failed: ${response.status()} ${await response.text()}`,
    ).toBeTruthy()
    return response.json()
  }

  async uploadMedia(fileName: string, buffer: Buffer, alt = 'test') {
    const response = await this.request.post(`${this.baseURL}/api/media`, {
      headers: this.authHeaders,
      multipart: {
        file: {
          name: fileName,
          mimeType: 'image/png',
          buffer,
        },
        alt,
      },
    })
    expect(response.ok(), `media upload failed: ${await response.text()}`).toBeTruthy()
    return response.json() as Promise<{ doc: { id: number } }>
  }

  async getGlobal<T = unknown>(slug: string) {
    const response = await this.request.get(`${this.baseURL}/api/globals/${slug}`, {
      headers: this.authHeaders,
    })
    expect(response.ok(), `global ${slug} get failed: ${await response.text()}`).toBeTruthy()
    return response.json() as Promise<T>
  }

  async updateGlobal<T = unknown>(slug: string, data: Record<string, unknown>) {
    const response = await this.request.post(`${this.baseURL}/api/globals/${slug}`, {
      headers: { ...this.authHeaders, 'Content-Type': 'application/json' },
      data,
    })
    expect(response.ok(), `global ${slug} update failed: ${await response.text()}`).toBeTruthy()
    return response.json() as Promise<T>
  }

  async micrositeContext(slug: string) {
    const response = await this.request.get(`${this.baseURL}/api/microsites/${slug}/context`)
    expect(response.ok(), `microsite context failed: ${await response.text()}`).toBeTruthy()
    return response.json()
  }

  async graphql(query: string, variables?: Record<string, unknown>) {
    const response = await this.request.post(`${this.baseURL}/api/graphql`, {
      headers: { ...this.authHeaders, 'Content-Type': 'application/json' },
      data: { query, variables },
    })
    expect(response.ok(), `graphql failed: ${await response.text()}`).toBeTruthy()
    return response.json()
  }
}

export function unwrapDoc<T extends { id?: string | number; doc?: T }>(result: T): T {
  return (result.doc ?? result) as T
}
