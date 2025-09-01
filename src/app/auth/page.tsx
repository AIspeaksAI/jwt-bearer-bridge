"use client"

import { useState, useEffect } from "react"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import ReactJsonView from "@microlink/react-json-view"
import Confetti from "react-confetti"

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
  const [showConfetti, setShowConfetti] = useState(false)
  const [shakeCard, setShakeCard] = useState(false)
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })

  const { toast } = useToast()
  const { 
    jwtToken, 
    jwtFormData, 
    accessToken, 
    instanceUrl, 
    setAccessToken, 
    setInstanceUrl 
  } = useAppStore()

  // Set window dimensions for confetti
  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    detectSize()
    window.addEventListener('resize', detectSize)
    
    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [])

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
        // Success - trigger confetti
        setAccessToken(responseData.access_token)
        setInstanceUrl(responseData.instance_url)
        
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 8000) // Stop confetti after 8 seconds

        toast({
          title: "Access Token Retrieved Successfully",
          description: "You can now use the API Query page to execute SOQL queries.",
          className: "border-primary bg-primary/10 text-primary [&>div]:text-primary"
        })
      } else {
        // Error response - trigger shake
        const errorMessage = responseData.error_description || responseData.error || "Unknown error occurred"
        
        setShakeCard(true)
        setTimeout(() => setShakeCard(false), 800) // Remove shake after animation
        
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
      
      // Trigger shake for network errors too
      setShakeCard(true)
      setTimeout(() => setShakeCard(false), 800)

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
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          wind={0.05}
          initialVelocityX={8}
          initialVelocityY={25}
          colors={[
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
            '#10ac84', '#ee5a24', '#0984e3', '#6c5ce7', '#fd79a8',
            '#e17055', '#00b894', '#fdcb6e', '#e84393', '#74b9ff'
          ]}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <div className={`bg-card border border-border rounded-lg p-8 ${shakeCard ? 'animate-shake' : ''}`}>
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
                    <div className="max-h-96 overflow-y-auto">
                      <ReactJsonView
                        src={response}
                        theme="monokai"
                        style={{
                          backgroundColor: 'transparent',
                          fontSize: '13px'
                        }}
                        collapsed={false}
                        displayObjectSize={true}
                        displayDataTypes={false}
                        enableClipboard={true}
                        name="authResponse"
                      />
                    </div>
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