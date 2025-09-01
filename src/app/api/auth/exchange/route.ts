import { NextRequest, NextResponse } from 'next/server'

interface TokenExchangeRequest {
  jwt: string
  audience: string
}

interface SalesforceTokenResponse {
  access_token?: string
  instance_url?: string
  id?: string
  token_type?: string
  issued_at?: string
  signature?: string
  error?: string
  error_description?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TokenExchangeRequest = await request.json()
    const { jwt, audience } = body

    if (!jwt) {
      return NextResponse.json(
        { error: 'missing_jwt', error_description: 'JWT token is required' },
        { status: 400 }
      )
    }

    if (!audience) {
      return NextResponse.json(
        { error: 'missing_audience', error_description: 'Audience parameter is required' },
        { status: 400 }
      )
    }

    // Construct the Salesforce token endpoint
    const tokenEndpoint = `${audience}/services/oauth2/token`

    // Prepare the request body for Salesforce
    const requestBody = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })

    console.log('Making token exchange request to:', tokenEndpoint)

    // Make the request to Salesforce
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: requestBody.toString()
    })

    const responseData: SalesforceTokenResponse = await response.json()

    console.log('Salesforce response status:', response.status)
    console.log('Salesforce response data:', responseData)

    if (response.ok) {
      // Success - return the token data
      return NextResponse.json(responseData, { status: 200 })
    } else {
      // Error from Salesforce - pass it through with the original status
      return NextResponse.json(responseData, { status: response.status })
    }

  } catch (error) {
    console.error('Token exchange API error:', error)
    
    return NextResponse.json(
      {
        error: 'internal_error',
        error_description: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}