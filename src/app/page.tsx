"use client"

import { useState, useEffect } from "react"
import { Link as LinkIcon, RotateCcw, ExternalLink } from "lucide-react"
import { SignJWT, importPKCS8 } from "jose"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const [algorithm, setAlgorithm] = useState("RS256")
  const [issuer, setIssuer] = useState("")
  const [subject, setSubject] = useState("")
  const [audience, setAudience] = useState("https://login.salesforce.com")
  const [expiration, setExpiration] = useState("3600")
  const [privateKey, setPrivateKey] = useState("")
  const [expirationTime, setExpirationTime] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const { toast } = useToast()
  const { jwtToken, setJwtToken } = useAppStore()

  // Calculate and update expiration time display
  useEffect(() => {
    const expirationSeconds = parseInt(expiration) || 0
    const expTime = new Date(Date.now() + expirationSeconds * 1000)
    setExpirationTime(expTime.toLocaleString("en-US", {
      timeZone: "UTC",
      month: "2-digit",
      day: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }) + " UTC")
  }, [expiration])

  const resetAlgorithm = () => {
    setAlgorithm("RS256")
  }

  const resetExpiration = () => {
    setExpiration("3600")
  }

  const generateJWT = async () => {
    if (!issuer.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Issuer",
        description: "Please provide the Connected App Consumer Key."
      })
      return
    }

    if (!subject.trim()) {
      toast({
        variant: "destructive", 
        title: "Missing Subject",
        description: "Please provide the Salesforce Username."
      })
      return
    }

    if (!privateKey.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Private Key", 
        description: "Please provide the private key in PEM format."
      })
      return
    }

    setIsGenerating(true)

    try {
      // Calculate expiration timestamp
      const exp = Math.floor(Date.now() / 1000) + parseInt(expiration)
      const iat = Math.floor(Date.now() / 1000)

      // Create JWT payload
      const payload = {
        iss: issuer.trim(),
        sub: subject.trim(),
        aud: audience.trim(),
        exp,
        iat
      }

      // Import private key
      const privateKeyObj = await importPKCS8(privateKey.trim(), algorithm)

      // Generate JWT
      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: algorithm })
        .sign(privateKeyObj)

      // Store in global state
      setJwtToken(jwt)

      // Log to console
      console.log("Generated JWT:", jwt)

      toast({
        title: "JWT Generated Successfully",
        description: "Token has been generated and is ready for use."
      })

    } catch (error) {
      console.error("JWT Generation Error:", error)
      
      let errorMessage = "Failed to generate JWT. Please check your inputs."
      if (error instanceof Error) {
        if (error.message.includes("Invalid key")) {
          errorMessage = "Invalid private key format. Please ensure it's in valid PEM format."
        } else if (error.message.includes("algorithm")) {
          errorMessage = "Algorithm mismatch. Please verify your private key supports RS256."
        }
      }

      toast({
        variant: "destructive",
        title: "JWT Generation Failed",
        description: errorMessage
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const decodeJWT = () => {
    if (jwtToken) {
      const url = `https://jwt.io/#debugger-io?token=${jwtToken}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <LinkIcon className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-card-foreground">JWT Configuration</h1>
              <p className="text-muted-foreground mt-1">
                Configure your JWT parameters and generate a signed token for Salesforce authentication.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Two-column grid for main parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Algorithm */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetAlgorithm}
                      className="h-6 px-2 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger id="algorithm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RS256">RS256</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Issuer */}
                <div>
                  <Label htmlFor="issuer">Issuer (iss)</Label>
                  <Input
                    id="issuer"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Your Connected App Consumer Key"
                    className="mt-2"
                  />
                </div>

                {/* Subject */}
                <div>
                  <Label htmlFor="subject">Subject (sub)</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Salesforce Username"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Audience */}
                <div>
                  <Label htmlFor="audience">Audience (aud)</Label>
                  <Input
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Expiration */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="expiration">Expiration (seconds)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetExpiration}
                      className="h-6 px-2 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                  <Input
                    id="expiration"
                    type="number"
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Expires: {expirationTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Private Key - Full Width */}
            <div>
              <Label htmlFor="privateKey">Private Key</Label>
              <Textarea
                id="privateKey"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder={`-----BEGIN PRIVATE KEY-----
Your private key content
-----END PRIVATE KEY-----`}
                className="mt-2 font-mono text-sm min-h-[200px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={generateJWT}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? "Generating..." : "Generate JWT"}
              </Button>
              
              <Button
                variant="outline"
                onClick={decodeJWT}
                disabled={!jwtToken}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Decode JWT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}