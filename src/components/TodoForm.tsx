import { useState, type FormEvent } from 'react'
import { Icon } from './Icon'

export function TodoForm({ disabled, onAdd }: { disabled: boolean; onAdd: (title: string) => Promise<boolean> }) {
  const [title, setTitle] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || disabled) return
    if (await onAdd(title.trim())) setTitle('')
  }
  return (
    <form onSubmit={submit} className="add-form">
      <span className="text-stone-400"><Icon name="plus" size={22} /></span>
      <label htmlFor="new-todo" className="sr-only">新しいTODOのタイトル</label>
      <input id="new-todo" value={title} onChange={event => setTitle(event.target.value)} disabled={disabled} placeholder="次にやることを追加しましょう" autoComplete="off" />
      <button className="primary-button" disabled={disabled || !title.trim()} type="submit"><span>追加する</span><Icon name="arrow" size={17} /></button>
    </form>
  )
}
