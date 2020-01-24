import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todosAccess = new TodosAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todosAccess.getAllTodos()
}

export async function createTodo(
  createTodoReques: CreateTodoRequest
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = 'notImplemented'

  return await todosAccess.createTodo({
    
  })

}