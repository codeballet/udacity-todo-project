import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
// import { puts } from 'util'

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

    logger.info('deleteTodo dataLayer returning result: ', result)
    return result
  }

  async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest): Promise<any> {
    logger.info('Updating item with todoId ', todoId)

    const params = {
      TableName: this.todosTable,
      Key: { todoId },
      AttributeUpdates: {
        'name': {
          Action: "PUT",
          Value: updatedTodo.name
        },
        'dueDate': {
          Action: "PUT",
          Value: updatedTodo.dueDate
        },
        'done': {
          Action: "PUT",
          Value: updatedTodo.done
        }
      },
      ReturnValues: "ALL_NEW"
    }

    const result = await this.docClient.update(params, (err, data) => {
      if (err) console.log(err);
      else console.log(data);
    }).promise()

    logger.info('updateTodo dataLayer returning result: ', result)
    return result
  }

  async updateURL(todoId: string, uploadUrl: string): Promise<any> {
    logger.info('Updating attachmentUrl for todo item: ', todoId)

    const params = {
      TableName: this.todosTable,
      Key: { todoId },
      AttributeUpdates: {
        'attachmentUrl': {
          Action: "ADD",
          Value: uploadUrl
        }
      },
      ReturnValues: "UPDATED_NEW"
    }

    const result = await this.docClient.update(params, (err, data) => {
      if (err) console.log(err)
      else console.log(data)
    }).promise()

    return result
  }

}
