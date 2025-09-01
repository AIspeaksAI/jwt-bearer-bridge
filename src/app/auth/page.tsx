"use client"

import { useState } from "react"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"

interface SalesforceResponse {
  access_token?: string
  instance_url?: string
  id?: string
  token_type?: string
  issued_at?: string
  signature?: string
  error?: string
  error_description?: string
  [key: string]: any
}

export default function AuthPage() {
  const [isExchanging, setIsExchanging] = useState(false)
  const [response, setResponse] = useState<SalesforceResponse | null>(null)
  const [isResponseExpanded, setIsResponseExpanded] = useState(false)

  const { toast } = useToast()
  const { 
    jwtToken, 
    jwtFormData, 
    accessToken, 
    instanceUrl, 
    setAccessToken, 
    setInstanceUrl 
  } = useAppStore()

  const exchangeJWTForToken = async () => {
    if (!jwtToken) {
      toast({
        variant: "destructive",
        title: "No JWT Available",
        description: "Please generate a JWT first in the JWT Configuration page."
      })
      return
    }

    setIsExchanging(true)
    setResponse(null)

    try {
      // Get audience from JWT form data
      const audience = jwtFormData.audience || "https://login.salesforce.com"

      console.log("Calling backend API for token exchange:", {
        audience,
        hasJWT: !!jwtToken
      })

      // Call our backend API instead of Salesforce directly
      const response = await fetch('/api/auth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwt: jwtToken,
          audience: audience
        })
      })

      const responseData: SalesforceResponse = await response.json()
      console.log("Backend API Response:", responseData)

      setResponse(responseData)
      setIsResponseExpanded(true)

      if (response.ok && responseData.access_token && responseData.instance_url) {
        // Success
        setAccessToken(responseData.access_token)
        setInstanceUrl(responseData.instance_url)

        toast({
          title: "Access Token Retrieved Successfully",
          description: "You can now use the API Query page to execute SOQL queries.",
          className: "border-primary bg-primary/10 text-primary [&>div]:text-primary"
        })
      } else {
        // Error response
        const errorMessage = responseData.error_description || responseData.error || "Unknown error occurred"
        
        toast({
          variant: "destructive",
          title: "Token Exchange Failed",
          description: errorMessage
        })
      }

    } catch (error) {
      console.error("Token Exchange Error:", error)
      
      const errorResponse = {
        error: "network_error",
        error_description: error instanceof Error ? error.message : "Network error occurred"
      }
      
      setResponse(errorResponse)
      setIsResponseExpanded(true)

      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Failed to connect to backend API. Please try again."
      })
    } finally {
      setIsExchanging(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-card-foreground">Salesforce Authentication</h1>
              <p className="text-muted-foreground mt-1">
                Exchange your JWT for a Salesforce access token using the OAuth 2.0 JWT Bearer flow.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* JWT Status Display */}
            <div className="bg-secondary/20 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-card-foreground">JWT Status</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {jwtToken ? "JWT Generated" : "No JWT token generated"}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    jwtToken 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "bg-secondary text-muted-foreground border border-border"
                  }`}>
                    {jwtToken ? "Generated" : "Pending"}
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Button */}
            <Button 
              onClick={exchangeJWTForToken}
              disabled={!jwtToken || isExchanging}
              className="w-full"
            >
              {isExchanging ? "Exchanging JWT..." : "Exchange JWT for Access Token"}
            </Button>

            {/* Response Display */}
            {response && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {response.access_token ? "Success Response" : "Error Response"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                    className="flex items-center gap-2"
                  >
                    {isResponseExpanded ? (
                      <>
                        Hide Details
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Show Details
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                {isResponseExpanded && (
                  <div className="bg-secondary/20 border border-border rounded-lg p-4">
                    <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-all">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Access Token Status */}
                {accessToken && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-primary">Access Token Status</div>
                        <div className="text-sm text-primary/80 mt-1">
                          Token acquired successfully
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                        Authenticated
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}