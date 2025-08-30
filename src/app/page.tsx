import { Link as LinkIcon } from "lucide-react"

export default function HomePage() {
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
          
          {/* JWT Configuration form will be implemented in later phases */}
          <div className="text-muted-foreground">
            JWT Configuration form coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}