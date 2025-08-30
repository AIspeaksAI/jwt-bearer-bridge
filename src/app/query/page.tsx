import { Database } from "lucide-react"

export default function QueryPage() {
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
          
          {/* Query form will be implemented in later phases */}
          <div className="text-muted-foreground">
            API Query form coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}