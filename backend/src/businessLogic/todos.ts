import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'

const todosAccess = new TodosAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todosAccess.getAllTodos()
}