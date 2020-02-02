import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todosAccess = new TodosAccess()


export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const activeUser = parseUserId(jwtToken)
  return todosAccess.getAllTodos(activeUser)
}


export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todosAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    task: createTodoRequest.task,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: undefined
  })
}


export async function deleteTodo(todoId: string, jwtToken: string): Promise<any> {
  const activeUser = parseUserId(jwtToken)
  return await todosAccess.deleteTodo(todoId, activeUser)
}


export async function updateTodo(todoId: string, 
                                 updatedTodo: UpdateTodoRequest,
                                 jwtToken: string): Promise<any> {
  const activeUser = parseUserId(jwtToken)
  return await todosAccess.updateTodo(todoId, updatedTodo, activeUser)
}


export async function imageUpload(todoId: string, 
                                  jwtToken: string,
                                  newImage: any): Promise<string> {
  const activeUser = parseUserId(jwtToken)

  const upload = await todosAccess.updateURL(todoId, activeUser, newImage)

  return upload
}
