import type { Todo, TodoUpdate } from '../types/todo'

async function request(path = '', options: RequestInit = {}): Promise<Response> {
  let response: Response
  try {
    response = await fetch(`/api/todos${path}`, {
      ...options,
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)])
        : AbortSignal.timeout(15000),
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch (error) {
    if (options.signal?.aborted) throw error
    throw new Error('APIに接続できませんでした。接続状況を確認して、もう一度お試しください。')
  }
  if (!response.ok) {
    throw new Error(`処理に失敗しました（HTTP ${response.status}）。もう一度お試しください。`)
  }
  return response
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string' && typeof item.title === 'string' && typeof item.completed === 'boolean'
}

export const todoApi = {
  async list(signal?: AbortSignal): Promise<Todo[]> {
    const response = await request('', { signal })
    const data: unknown = await response.json()
    if (!Array.isArray(data) || !data.every(isTodo)) {
      throw new Error('TODO一覧の形式が正しくありません。APIのレスポンスを確認してください。')
    }
    return data
  },
  async create(title: string): Promise<void> {
    await request('', { method: 'POST', body: JSON.stringify({ title }) })
  },
  async update(id: string, todo: TodoUpdate): Promise<void> {
    await request(`/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(todo) })
  },
  async remove(id: string): Promise<void> {
    await request(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
