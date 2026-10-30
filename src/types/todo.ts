export interface Todo {
  id: string
  title: string
  completed: boolean
}

export type TodoUpdate = Pick<Todo, 'title' | 'completed'>
export type TodoFilter = 'all' | 'active' | 'completed'
