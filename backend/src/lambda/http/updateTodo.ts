import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../auth/utils'

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`updateTodo handler updating event: ${event}`)
  
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const jwtToken = getToken(event.headers.Authorization)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const changedTodo = await updateTodo(todoId, updatedTodo, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: changedTodo
    })
  }  
  
}
