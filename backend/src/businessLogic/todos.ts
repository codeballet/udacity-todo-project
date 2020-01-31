import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const s3 = new AWS.S3({ signatureVersion: 'v4' })
const todosAccess = new TodosAccess()

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function getAllTodos(principalId): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(principalId)
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

export async function deleteTodo(todoId: string): Promise<any> {
  return await todosAccess.deleteTodo(todoId)
}

export async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest): Promise<any> {
  return await todosAccess.updateTodo(todoId, updatedTodo)
}

export async function imageUrl(todoId: string): Promise<string> {
  const uploadUrl = getUploadUrl(todoId)
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  await todosAccess.updateURL(todoId, imageUrl)

  return uploadUrl
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}