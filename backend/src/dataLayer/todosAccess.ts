import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todosAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    logger.info('Getting all Todos')

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info(`Creating a Todo item with todoId ${todo.todoId}`)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async deleteTodo(todoId): Promise<any> {
    logger.info('Deleting item with todoId ', todoId)

    const params = {
      TableName : this.todosTable,
      Key: {
        todoId
      },
      ReturnValues: "ALL_OLD"
    }

    const result = await this.docClient.delete(params, (err, data) => {
      if (err) logger.info('Error trying to delete item: ', err)
      else {
        logger.info('Deleting item: ', data)
      }
    }).promise()

    return result.Attributes
  }

  async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest): Promise<TodoItem> {
    logger.info('Updating item with todoId ', todoId)

    return undefined
  }

}