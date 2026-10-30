import { useState } from 'react'
import { Icon } from './components/Icon'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useTodos } from './hooks/useTodos'
import type { TodoFilter } from './types/todo'
import './App.css'

const filters: { value: TodoFilter; label: string; icon: 'list' | 'circle' | 'check' }[] = [
  { value: 'all', label: 'すべてのTODO', icon: 'list' },
  { value: 'active', label: '未完了', icon: 'circle' },
  { value: 'completed', label: '完了済み', icon: 'check' },
]

function App() {
  const { todos, loading, busy, error, notice, reload, add, update, remove } = useTodos()
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [query, setQuery] = useState('')
  const completed = todos.filter(todo => todo.completed).length
  const active = todos.length - completed
  const counts = { all: todos.length, active, completed }
  const progress = todos.length ? Math.round(completed / todos.length * 100) : 0
  const visible = todos.filter(todo => (filter === 'all' || (filter === 'completed' ? todo.completed : !todo.completed)) && todo.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const currentLabel = filters.find(item => item.value === filter)!.label
  const disabled = loading || busy

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/" className="brand" aria-label="ひとつ ホーム"><span className="brand-mark"><Icon name="check" size={23} /></span><span>ひとつ<span className="brand-dot">.</span></span></a>
        <div className="sidebar-content">
          <p className="nav-caption">マイワークスペース</p>
          <nav aria-label="TODOの絞り込み" className="nav-list">
            {filters.map(item => <button key={item.value} className={`nav-item ${filter === item.value ? 'selected' : ''}`} aria-current={filter === item.value ? 'page' : undefined} onClick={() => setFilter(item.value)}><Icon name={item.icon} size={19} /><span>{item.label}</span><span className="nav-count">{loading ? '—' : counts[item.value]}</span></button>)}
          </nav>
        </div>
        <div className="sidebar-bottom"><div className="little-note"><Icon name="leaf" size={24} /><p>小さな一歩が、<br />大きな前進につながる。</p><span>自分のペースで、ひとつずつ。</span></div><div className="workspace-label"><span className="workspace-avatar">私</span><div>パーソナル<span>自分だけのワークスペース</span></div></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar"><span>ワークスペース <span className="breadcrumb-slash">/</span> <strong>TODO</strong></span><span className="topbar-detail"><span className="small-dot" />ひとつずつ、着実に。</span></header>
        <main className="main-content">
          <div className="page-heading"><div><p className="eyebrow">MAKE ROOM FOR WHAT MATTERS</p><h1>今日も、ひとつずつ<span className="text-lime-600">。</span></h1><p className="page-description">やることを整理して、気持ちに余白を。</p></div><div className="heading-symbol" aria-hidden="true"><Icon name="leaf" size={35} /></div></div>

          <section aria-label="TODOの進捗" className="overview">
            <div className="stat"><span>すべてのTODO</span><div>{loading ? '—' : todos.length}<small>件</small></div></div>
            <div className="stat"><span><i className="stat-dot active-dot" />未完了</span><div>{loading ? '—' : active}<small>件</small></div></div>
            <div className="stat"><span><i className="stat-dot complete-dot" />完了済み</span><div>{loading ? '—' : completed}<small>件</small></div></div>
            <div className="progress-stat"><div><span>達成率</span><strong>{loading ? '—' : progress}<small>%</small></strong></div><div role="progressbar" aria-label="TODOの達成率" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="progress-track"><span style={{ width: `${progress}%` }} /></div><p>{todos.length && completed === todos.length ? 'すべて完了。おつかれさまでした！' : '一歩ずつ、前に進んでいます。'}</p></div>
          </section>

          <section aria-labelledby="todo-list-title" className="todo-section">
            <div className="section-heading"><h2 id="todo-list-title">マイTODO</h2><span>小さなことも、ここから。</span></div>
            <TodoForm disabled={disabled} onAdd={add} />
            {error && <div className="error-banner" role="alert"><p>{error}</p><button disabled={disabled} onClick={() => void reload()}><Icon name="refresh" size={15} />再読み込み</button></div>}
            <div className="list-toolbar"><div role="group" aria-label="表示するTODO" className="filter-tabs">{filters.map(item => <button key={item.value} aria-pressed={filter === item.value} className={filter === item.value ? 'tab-active' : ''} onClick={() => setFilter(item.value)}>{item.value === 'all' ? 'すべて' : item.label}<span>{loading ? '—' : counts[item.value]}</span></button>)}</div><div className="search-field"><Icon name="search" size={16} /><label htmlFor="search" className="sr-only">TODOを検索</label><input id="search" placeholder="TODOを検索" type="search" value={query} onChange={event => setQuery(event.target.value)} /></div></div>
            <div className="todo-list-container" aria-busy={disabled}>
              {loading ? <div className="loading-state" role="status"><span className="spinner" />TODOを読み込んでいます…</div> : visible.length ? <ul className="todo-list">{visible.map(todo => <TodoItem key={todo.id} todo={todo} disabled={disabled} onUpdate={update} onDelete={remove} />)}</ul> : <div className="empty-state"><span className="empty-icon"><Icon name={error ? 'refresh' : filter === 'completed' ? 'check' : 'list'} size={26} /></span><h3>{error && !todos.length ? 'エラーが発生しました' : query ? '一致するTODOはありません' : filter === 'completed' ? '完了したTODOはまだありません' : filter === 'active' && todos.length ? 'すべてのTODOが完了しました' : 'やることを、ひとつ書き出してみましょう'}</h3><p>{error && !todos.length ? '上のエラー内容をご確認ください。' : query ? '別のキーワードで検索してみてください。' : '小さな一歩から、気持ちよく始めましょう。'}</p></div>}
              <div className="list-footer"><span>{currentLabel} <strong>{loading ? '—' : visible.length}</strong> 件</span><span role="status" aria-live="polite">{busy ? '保存しています…' : notice || 'あなたのペースで進めましょう'}</span></div>
            </div>
          </section>
          <footer className="page-footer"><span className="footer-brand">ひとつ.</span><span>毎日に、少しの余白を。</span></footer>
        </main>
      </div>
    </div>
  )
}
export default App
