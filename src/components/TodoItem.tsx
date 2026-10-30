import { useState, type FormEvent } from 'react'
import type { Todo, TodoUpdate } from '../types/todo'
import { Icon } from './Icon'

interface Props {
  todo: Todo
  disabled: boolean
  onUpdate: (id: string, value: TodoUpdate) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}

export function TodoItem({ todo, disabled, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (disabled || !title.trim()) return
    if (title.trim() === todo.title || await onUpdate(todo.id, { title: title.trim(), completed: todo.completed })) setEditing(false)
  }
  return (
    <li className={`todo-row ${todo.completed ? 'is-completed' : ''}`} aria-busy={disabled}>
      <button className="todo-checkbox" role="checkbox" aria-checked={todo.completed} aria-label={`「${todo.title}」を${todo.completed ? '未完了' : '完了'}にする`} disabled={disabled || editing} onClick={() => void onUpdate(todo.id, { title: todo.title, completed: !todo.completed })}>
        {todo.completed && <Icon name="check" size={15} />}
      </button>
      {editing ? (
        <form onSubmit={save} className="edit-form" onKeyDown={event => { if (event.key === 'Escape' && !disabled) setEditing(false) }}>
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>TODOのタイトルを編集</label>
          <input id={`edit-${todo.id}`} autoFocus value={title} onChange={event => setTitle(event.target.value)} disabled={disabled} />
          <div className="flex gap-2"><button className="save-button" disabled={disabled || !title.trim()}>保存</button><button type="button" className="icon-button" disabled={disabled} aria-label="編集をキャンセル" onClick={() => setEditing(false)}><Icon name="close" size={17} /></button></div>
        </form>
      ) : (
        <>
          <span className="todo-title">{todo.title}</span>
          <div className="row-actions">
            <button className="icon-button" disabled={disabled} aria-label={`「${todo.title}」を編集`} title="タイトルを編集" onClick={() => { setTitle(todo.title); setEditing(true) }}><Icon name="edit" size={17} /></button>
            <button className="icon-button delete-button" disabled={disabled} aria-label={`「${todo.title}」を削除`} title="TODOを削除" onClick={() => void onDelete(todo.id)}><Icon name="trash" size={17} /></button>
          </div>
        </>
      )}
    </li>
  )
}
