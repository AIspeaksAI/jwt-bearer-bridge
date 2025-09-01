"use client"

import { useState } from "react"
import { Database, ChevronDown, ChevronUp, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"

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

export default function QueryPage() {
  const [query, setQuery] = useState("SELECT Id, Name FROM Account LIMIT 10")
  const [isExecuting, setIsExecuting] = useState(false)
  const [queryResults, setQueryResults] = useState<SalesforceQueryResponse | null>(null)
  const [isResultsExpanded, setIsResultsExpanded] = useState(false)

  const { toast } = useToast()
  const { accessToken, instanceUrl } = useAppStore()

  const resetQuery = () => {
    setQuery("SELECT Id, Name FROM Account LIMIT 10")
  }

  const executeQuery = async () => {
    if (!accessToken || !instanceUrl) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "Please complete the authentication process first."
      })
      return
    }

    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Query",
        description: "Please enter a SOQL query to execute."
      })
      return
    }

    setIsExecuting(true)
    setQueryResults(null)

    try {
      console.log("Executing SOQL query:", query)

      // Call our backend API for the query
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query.trim(),
          accessToken,
          instanceUrl
        })
      })

      const responseData: SalesforceQueryResponse = await response.json()
      console.log("Query API Response:", responseData)

      setQueryResults(responseData)
      setIsResultsExpanded(true)

      if (response.ok && responseData.records) {
        // Success
        const recordCount = responseData.totalSize || responseData.records.length || 0
        
        toast({
          title: "Query Executed Successfully",
          description: `Retrieved ${recordCount} record${recordCount !== 1 ? 's' : ''} from Salesforce.`,
          className: "border-primary bg-primary/10 text-primary [&>div]:text-primary"
        })
      } else {
        // Error response
        const errorMessage = responseData.error_description || responseData.message || responseData.error || "Unknown error occurred"
        
        toast({
          variant: "destructive",
          title: "Query Failed",
          description: errorMessage
        })
      }

    } catch (error) {
      console.error("Query Execution Error:", error)
      
      const errorResponse = {
        error: "network_error",
        error_description: error instanceof Error ? error.message : "Network error occurred"
      }
      
      setQueryResults(errorResponse)
      setIsResultsExpanded(true)

      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Failed to execute query. Please try again."
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const formatResults = (results: SalesforceQueryResponse) => {
    if (results.records && results.records.length > 0) {
      return {
        summary: {
          totalSize: results.totalSize,
          recordCount: results.records.length,
          done: results.done
        },
        records: results.records
      }
    }
    return results
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-card-foreground">Salesforce API Query</h1>
              <p className="text-muted-foreground mt-1">
                Execute SOQL queries against your Salesforce org using the obtained access token.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Access Token Status Display */}
            <div className="bg-secondary/20 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-card-foreground">Access Token Status</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {accessToken ? "Access Token Acquired" : "No access token available"}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    accessToken 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "bg-secondary text-muted-foreground border border-border"
                  }`}>
                    {accessToken ? "Authenticated" : "Not Authenticated"}
                  </div>
                </div>
              </div>
            </div>

            {/* SOQL Query Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="soqlQuery">SOQL Query</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetQuery}
                  className="h-6 px-2 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
              <Textarea
                id="soqlQuery"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={!accessToken}
                placeholder="SELECT Id, Name FROM Account LIMIT 10"
                className="mt-2 font-mono text-sm min-h-[120px] resize-y"
              />
            </div>

            {/* Execute Button */}
            <Button 
              onClick={executeQuery}
              disabled={!accessToken || isExecuting || !query.trim()}
              className="w-full flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isExecuting ? "Executing Query..." : "Execute Query"}
            </Button>

            {/* Query Results Display */}
            {queryResults && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {queryResults.records ? "Query Results" : "Query Error"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                    className="flex items-center gap-2"
                  >
                    {isResultsExpanded ? (
                      <>
                        Hide Results
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Show Results
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Results Summary */}
                {queryResults.records && queryResults.totalSize !== undefined && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <div className="text-sm text-primary">
                      <strong>Total Records:</strong> {queryResults.totalSize} | 
                      <strong> Returned:</strong> {queryResults.records.length} | 
                      <strong> Complete:</strong> {queryResults.done ? 'Yes' : 'No'}
                    </div>
                  </div>
                )}

                {/* Expanded Results */}
                {isResultsExpanded && (
                  <div className="bg-secondary/20 border border-border rounded-lg p-4">
                    <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
                      {JSON.stringify(formatResults(queryResults), null, 2)}
                    </pre>
                  </div>
                )}

                {/* Quick Record View */}
                {queryResults.records && queryResults.records.length > 0 && (
                  <div className="bg-secondary/20 border border-border rounded-lg p-4">
                    <h4 className="font-medium text-card-foreground mb-3">Records Preview</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {queryResults.records.slice(0, 5).map((record, index) => (
                        <div key={index} className="text-sm border-l-2 border-primary/30 pl-3">
                          <div className="font-mono text-primary text-xs mb-1">Record {index + 1}</div>
                          {Object.entries(record)
                            .filter(([key]) => key !== 'attributes')
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div key={key} className="text-muted-foreground">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                        </div>
                      ))}
                      {queryResults.records.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center pt-2">
                          ... and {queryResults.records.length - 5} more records
                        </div>
                      )}
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