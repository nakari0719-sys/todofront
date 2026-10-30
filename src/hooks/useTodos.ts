import { useEffect, useRef, useState } from 'react'
import { todoApi } from '../lib/api'
import type { Todo, TodoUpdate } from '../types/todo'

const errorMessage = (error: unknown) => error instanceof Error ? error.message : '予期しないエラーが発生しました。'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const locked = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    todoApi.list(controller.signal)
      .then(setTodos)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setError(errorMessage(error))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  async function reload() {
    if (locked.current) return
    locked.current = true
    setLoading(true)
    setError(null)
    try {
      setTodos(await todoApi.list())
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setLoading(false)
      locked.current = false
    }
  }

  async function mutate(action: () => Promise<void>, message: string): Promise<boolean> {
    if (locked.current || loading) return false
    locked.current = true
    setBusy(true)
    setError(null)
    setNotice('')
    try {
      await action()
      setNotice(message)
      // Mutation responses may be empty (for example, DELETE 204).
      // Fetch the canonical collection rather than assuming a response body.
      try {
        setTodos(await todoApi.list())
      } catch (error) {
        setError(`変更は保存されましたが、一覧を更新できませんでした。${errorMessage(error)}`)
      }
      return true
    } catch (error) {
      setError(errorMessage(error))
      return false
    } finally {
      setBusy(false)
      locked.current = false
    }
  }

  return {
    todos, loading, busy, error, notice, reload,
    add: (title: string) => mutate(() => todoApi.create(title), 'TODOを追加しました。'),
    update: (id: string, value: TodoUpdate) => mutate(() => todoApi.update(id, value), 'TODOを更新しました。'),
    remove: (id: string) => mutate(() => todoApi.remove(id), 'TODOを削除しました。'),
  }
}
