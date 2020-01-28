/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  task: string
  dueDate: string
  done: boolean
}