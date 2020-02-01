import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { imageUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../auth/utils'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`generateUploadUrl is processing event ${event}`)

  const todoId = event.pathParameters.todoId
  const jwtToken = getToken(event.headers.Authorization)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const upploadUrl = await imageUrl(todoId, jwtToken)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: upploadUrl
    })
  }
  
}
