import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
// import { puts } from 'util'

const logger = createLogger('todosAccess')

const bucketName = process.env.IMAGES_S3_BUCKET
// const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  async getAllTodos(activeUser: string): Promise<TodoItem[]> {
    logger.info(`Getting all Todos for user: ${activeUser}`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': activeUser
      }
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

  async deleteTodo(todoId: string, activeUser: string): Promise<any> {
    logger.info(`Deleting item with todoId ${todoId}`)
    logger.info(`Deleting item with userId ${activeUser}`)

    const params = {
      TableName : this.todosTable,
      Key: { todoId },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': activeUser
      },
      ReturnValues: "ALL_OLD"
    }

    const result = await this.docClient.delete(params).promise()

    return result
  }

  async updateTodo(todoId: string, 
                   updatedTodo: UpdateTodoRequest, 
                   activeUser: string): Promise<any> {
    logger.info(`dataLayer updateTodo updating item with todoId ${todoId}`)

    const params = {
      TableName: this.todosTable,
      Key: { todoId },
      UpdateExpression: 'set task = :t, dueDate = :dD, done = :d',
      ConditionExpression: 'userId = :uId',
      ExpressionAttributeValues: {
        ':t':updatedTodo.task,
        ':dD':updatedTodo.dueDate,
        ':d':updatedTodo.done,
        ':uId':activeUser
      },
      ReturnValues: "ALL_NEW"
    }

    const result = await this.docClient.update(params).promise()

    logger.info(`updateTodo dataLayer returning result: ${result}`)
    return result
  }

  async updateURL(todoId: string, 
                  activeUser: string,
                  newImage: any): Promise<any> {
    logger.info(`Updating attachmentUrl for todo item: ${todoId}`)

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const imageData = {
      ...newImage
    }
    const params = {
      TableName: this.todosTable,
      Key: { todoId },
      UpdateExpression: 'set attachementUrl = :a, imageData = :iD',
      ConditionExpression: 'userId = :uId',
      ExpressionAttributeValues: {
        ':a':imageUrl,
        ':uId':activeUser,
        ':iD':imageData
      },
      ReturnValues: "UPDATED_NEW"
    }

    const result = await this.docClient.update(params).promise()

    return result
  }

}
