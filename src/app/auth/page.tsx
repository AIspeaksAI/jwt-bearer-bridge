import { Shield } from "lucide-react"

export default function AuthPage() {
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
          
          {/* Auth form will be implemented in later phases */}
          <div className="text-muted-foreground">
            Salesforce Authentication form coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}