import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUpload } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../auth/utils'

const s3 = new AWS.S3({ signatureVersion: 'v4' })
const logger = createLogger('generateUploadUrl')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`generateUploadUrl is processing event`)

  const todoId = event.pathParameters.todoId
  const jwtToken = getToken(event.headers.Authorization)

  const newImage = await generateUpload(todoId, jwtToken)

  const uploadUrl = getUploadUrl(todoId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      imageData: newImage,
      uploadUrl: uploadUrl
    })
  }
  
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}