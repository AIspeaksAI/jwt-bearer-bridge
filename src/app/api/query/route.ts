import { NextRequest, NextResponse } from 'next/server'

interface QueryRequest {
  query: string
  accessToken: string
  instanceUrl: string
}

interface SalesforceQueryResponse {
  totalSize?: number
  done?: boolean
  records?: any[]
  error?: string
  error_description?: string
  message?: string
  errorCode?: string
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json()
    const { query, accessToken, instanceUrl } = body

    if (!query) {
      return NextResponse.json(
        { error: 'missing_query', error_description: 'SOQL query is required' },
        { status: 400 }
      )
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'missing_token', error_description: 'Access token is required' },
        { status: 400 }
      )
    }

    if (!instanceUrl) {
      return NextResponse.json(
        { error: 'missing_instance_url', error_description: 'Instance URL is required' },
        { status: 400 }
      )
    }

    // Encode the SOQL query for URL
    const encodedQuery = encodeURIComponent(query.trim())
    
    // Construct the Salesforce query endpoint
    const queryEndpoint = `${instanceUrl}/services/data/v60.0/query/?q=${encodedQuery}`

    console.log('Making SOQL query request to:', queryEndpoint)
    console.log('Query:', query)

    // Make the request to Salesforce
    const response = await fetch(queryEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const responseData: SalesforceQueryResponse = await response.json()

    console.log('Salesforce query response status:', response.status)
    console.log('Salesforce query response data:', responseData)

    if (response.ok) {
      // Success - return the query results
      return NextResponse.json(responseData, { status: 200 })
    } else {
      // Error from Salesforce - pass it through with the original status
      return NextResponse.json(responseData, { status: response.status })
    }

  } catch (error) {
    console.error('SOQL query API error:', error)
    
    return NextResponse.json(
      {
        error: 'internal_error',
        error_description: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}