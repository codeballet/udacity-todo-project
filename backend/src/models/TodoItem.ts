export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  task: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  imageData?: any
}
