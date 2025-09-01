# JWT Bearer Bridge

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8)](https://tailwindcss.com/)

A comprehensive developer utility for testing Salesforce OAuth 2.0 JWT Bearer Flow authentication. This tool provides a complete web interface for generating JWTs, exchanging them for access tokens, and executing SOQL queries against Salesforce orgs.

## 📺 Educational Purpose

This application was built as an educational tool to support the videos on [AI Speaks AI YouTube Channel](https://www.youtube.com/@AIspeaksAI). If you find this tool helpful, please consider **liking** and **subscribing** to the channel for more content and AI-powered coding insights!

## ✨ Features

- **🔐 JWT Generation**: Create and sign JWTs with RS256 algorithm
- **🔄 Token Exchange**: Exchange JWTs for Salesforce access tokens via OAuth 2.0 JWT Bearer Flow
- **📊 SOQL Query Execution**: Execute and visualize SOQL query results
- **🔍 Smart Record Preview**: Intelligent field prioritization for common Salesforce objects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Salesforce Connected App configured for JWT Bearer Flow

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AIspeaksAI/jwt-bearer-bridge.git
   cd jwt-bearer-bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Usage

### Phase 1: JWT Configuration

1. Navigate to the **JWT Configuration** page
2. Fill in the required parameters:
   - **Algorithm**: RS256 (pre-selected)
   - **Issuer**: Your Connected App Consumer Key
   - **Subject**: Salesforce Username
   - **Audience**: Salesforce login URL (default: https://login.salesforce.com)
   - **Expiration**: Token lifetime in seconds (default: 3600)
   - **Private Key**: Your RSA private key in PEM format

3. Click **Generate JWT** to create your signed token
4. Use the **Decode JWT** button to verify the token at jwt.io

### Phase 2: Salesforce Authentication

1. Navigate to the **Salesforce Authentication** page
2. Ensure your JWT is generated (from Phase 1)
3. Click **Exchange JWT for Access Token**
4. View the response with access token and instance URL

### Phase 3: SOQL Query Execution

1. Navigate to the **API Query** page
2. Ensure you have a valid access token (from Phase 2)
3. Enter your SOQL query (default provided)
4. Click **Execute Query** to run against your Salesforce org
5. View results in the interactive JSON viewer and record preview

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **JWT Handling**: [jose](https://github.com/panva/jose)
- **JSON Viewer**: [@microlink/react-json-view](https://github.com/microlinkhq/react-json-view)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
jwt-bearer-bridge/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # JWT Configuration
│   │   ├── auth/              # Salesforce Authentication
│   │   ├── query/             # SOQL Query Execution
│   │   └── api/               # Backend API routes
│   │       ├── auth/exchange/ # Token exchange endpoint
│   │       └── query/         # SOQL query endpoint
│   ├── components/ui/         # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities and stores
├── public/                    # Static assets
└── package.json
```

## 🔧 Configuration

### Salesforce Connected App Setup

1. **Create a Connected App** in your Salesforce org:
   - Enable OAuth Settings
   - Add scopes
   - Enable "Use digital signatures"
   - Upload your certificate

2. **Generate RSA Key Pair**:
   ```bash
   # Generate a private key
   openssl genrsa -out server.key 2048

   # Create a certificate signing request
   openssl req -new -key server.key -out server.csr

   # Create a self-signed certificate
   openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
   ```

3. **Configure JWT Bearer Flow**:
   - [Salesforce Documentation](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_jwt_flow.htm&type=5)
   - Upload the certificate to your Connected App
   - Note the Consumer Key for the JWT issuer field
   


## 🚀 Deployment

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement changes**
3. **Test thoroughly**
4. **Commit and push**
   ```bash
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Access Tokens**: Tokens are stored only in browser memory (not localStorage)
- **CORS Protection**: All Salesforce API calls are proxied through backend routes
- **Input Validation**: All user inputs are validated and sanitized

## 🐛 Troubleshooting

### Common Issues

**JWT Generation Fails**
- Verify private key format (PEM)
- Ensure all required fields are filled
- Check key compatibility with RS256

**Token Exchange Fails**
- Verify Connected App configuration
- Check Consumer Key matches JWT issuer
- Ensure certificate is properly uploaded
- Verify user permissions in Salesforce

**SOQL Query Fails**
- Confirm valid access token
- Check SOQL syntax
- Verify object and field permissions
- Ensure query limits are reasonable

### Getting Help

1. **Check the browser console** for detailed error messages
2. **Verify Salesforce setup** using Salesforce documentation
3. **Test JWT at jwt.io** to verify token structure
4. **Review API responses** in the interactive JSON viewer

## 🤝 Contributing

We welcome contributions!

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Salesforce](https://salesforce.com) for comprehensive OAuth 2.0 documentation
- [Next.js](https://nextjs.org/) team for an excellent React framework
- [shadcn](https://ui.shadcn.com/) for beautiful, accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- The open-source community for invaluable tools and libraries

## 📞 Support

- **Documentation**: This README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/AIspeaksAI/jwt-bearer-bridge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AIspeaksAI/jwt-bearer-bridge/discussions)

## 🤖 AI Development

This application was developed with the assistance of [Claude](https://claude.ai), Anthropic's AI assistant. Claude helped with code generation, architecture decisions, documentation, and best practices implementation throughout the development process.

---

**Built with ❤️ for the Salesforce developer community**