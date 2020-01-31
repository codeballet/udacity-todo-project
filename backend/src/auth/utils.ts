import { APIGatewayProxyEvent } from 'aws-lambda'
import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}


/**
 * Split an Authorization header and return a JWT token
 * @param authHeader to extract
 * @returns a JWT token
 */
export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}


/**
 * Parse an API Gateway event header and return an authorization header
 * @param event to extract
 * @returns an authorization header
 */
export function getAuthHeader(event: APIGatewayProxyEvent): string {
  if (!event) throw new Error('No event received')
  
  const result = JSON.stringify(event.headers)
  const jsonResult = JSON.parse(result)
  const authHeader: string = jsonResult.Authorization

  return authHeader
}