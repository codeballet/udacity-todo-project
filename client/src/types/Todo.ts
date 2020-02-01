export interface Todo {
  todoId: string
  createdAt: string
  task: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
