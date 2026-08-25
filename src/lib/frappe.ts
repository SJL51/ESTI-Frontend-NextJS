/**
 * Thin client over the Frappe REST/RPC API.
 */
import axios, { type AxiosInstance } from "axios"

const frappeClient: AxiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
})

// Issue #9 Fix: Use a module-level variable and request interceptor so 
// the CSRF token reliably attaches to every subsequent request.
let csrfToken: string | undefined

export function setCSRFToken(token: string | undefined) {
  csrfToken = token
}

frappeClient.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers["X-Frappe-CSRF-Token"] = csrfToken
  }
  return config
})

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; exception?: string; _server_messages?: string }
      | undefined
    if (data?._server_messages) {
      try {
        const messages = JSON.parse(data._server_messages) as string[]
        if (messages[0]) {
          const parsed = JSON.parse(messages[0]) as { message?: string }
          if (parsed.message) return parsed.message
        }
      } catch {
        // fall through to the other fields
      }
    }
    if (data?.exception) return data.exception.replace(/^[\w.]+:\s*/, "")
    if (data?.message) return data.message
  }
  return "Something went wrong"
}

export interface FrappeListParams {
  fields?: string[]
  filters?: Array<[string, string, unknown]> | Record<string, unknown>
  order_by?: string
  limit_start?: number
  limit_page_length?: number
}

export const frappe = {
  /** GET /api/resource/<doctype> — list view for Master/Detail screens. */
  async list<T = Record<string, unknown>>(
    doctype: string,
    params: FrappeListParams = {}
  ): Promise<T[]> {
    const { data } = await frappeClient.get(
      `/api/resource/${encodeURIComponent(doctype)}`,
      {
        params: {
          fields: JSON.stringify(params.fields ?? ["name"]),
          filters: params.filters ? JSON.stringify(params.filters) : undefined,
          order_by: params.order_by,
          limit_start: params.limit_start,
          limit_page_length: params.limit_page_length ?? 20,
        },
      }
    )
    return data.data as T[]
  },

  /** GET /api/resource/<doctype>/<name> — single document for detail panels. */
  async getDoc<T = Record<string, unknown>>(
    doctype: string,
    name: string
  ): Promise<T> {
    const { data } = await frappeClient.get(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`
    )
    return data.data as T
  },

  /** POST /api/resource/<doctype> — create. */
  async createDoc<T = Record<string, unknown>>(
    doctype: string,
    values: Record<string, unknown>
  ): Promise<T> {
    const { data } = await frappeClient.post(
      `/api/resource/${encodeURIComponent(doctype)}`,
      values
    )
    return data.data as T
  },

  /** PUT /api/resource/<doctype>/<name> — update. */
  async updateDoc<T = Record<string, unknown>>(
    doctype: string,
    name: string,
    values: Record<string, unknown>
  ): Promise<T> {
    const { data } = await frappeClient.put(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
      values
    )
    return data.data as T
  },

  /** DELETE /api/resource/<doctype>/<name>. */
  async deleteDoc(doctype: string, name: string): Promise<void> {
    await frappeClient.delete(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`
    )
  },

  /**
   * POST /api/method/upload_file — uploads a file standalone (not attached
   * to a doctype/docname at upload time, so this works the same whether the
   * record is new or already saved). Returns a permanent file_url to store
   * on the relevant "Attach Image"/"Attach" field before saving the doc.
   * Files are uploaded public by default (is_private=0) — fine for profile
   * photos; pass isPrivate: true for anything that should be access-gated.
   */
  async uploadFile(
    file: File,
    opts: { isPrivate?: boolean } = {}
  ): Promise<{ file_url: string; name: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("is_private", opts.isPrivate ? "1" : "0")
    const { data } = await frappeClient.post("/api/method/upload_file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data.message as { file_url: string; name: string }
  },

  /** Whitelisted RPC */
  async call<T = unknown>(
    method: string,
    args: Record<string, unknown> = {}
  ): Promise<T> {
    const { data } = await frappeClient.post(`/api/method/${method}`, args)
    return data.message as T
  },

  async login(usr: string, pwd: string) {
    const { data } = await frappeClient.post("/api/method/login", { usr, pwd })
    return data
  },

  async logout() {
    await frappeClient.post("/api/method/logout")
  },

  /** campus_erp.api.auth.me() — roles + visible module list for the sidebar. */
  async me() {
    // Issue #8 Fix: Switch from POST to GET to avoid triggering CSRF checks on page refresh
    const { data } = await frappeClient.get(
      "/api/method/campus_erp.api.auth.me"
    )
    return data.message as {
      user: string
      full_name: string
      roles: string[]
      modules: string[]
      csrf_token: string
    }
  },
}

export default frappeClient