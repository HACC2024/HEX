# HEX Chatbot System Architecture

This diagram represents the complete system architecture of the HEX Chatbot, including both the Admin and Uncle HEX interfaces, backend services, and external integrations.

```mermaid
flowchart TB
    subgraph Frontend["Next.js Frontend Application"]
        subgraph AdminInterface["Admin Chatbot Interface"]
            AdminUI["Chat UI Component"]
            AdminForm["Message Input Form"]
            AdminHistory["Chat History State"]
            AdminState["React State Management"]
            AdminValidation["Input Validation"]
        end

        subgraph UncleInterface["Uncle HEX Interface"]
            UncleUI["Chat UI Component"]
            UncleForm["Message Input Form"]
            FileUpload["File Upload Component"]
            FileSelect["File Selection Dropdown"]
            UncleHistory["Chat History State"]
            UncleState["React State Management"]
            FileValidation["File Type Validation"]
        end

        subgraph APIClients["API Client Layer"]
            ChatAPIClient["Admin API Client
            - Error handling
            - Response formatting
            - State updates"]
            
            UncleAPIClient["Uncle HEX API Client
            - File handling
            - Error handling
            - Response formatting"]
        end
    end

    subgraph AWSInfra["AWS EC2 Infrastructure"]
        subgraph DockerEnv["Docker Environment"]
            NGINX["NGINX Reverse Proxy
            - SSL termination
            - Request routing
            - Load balancing
            - Rate limiting"]
            
            subgraph FlaskBackend["Flask Backend Services"]
                subgraph Endpoints["API Endpoints"]
                    AdminEndpoint["/api/chatbot
                    - Request validation
                    - Error handling"]
                    
                    UncleEndpoint["/api/uncle-hex
                    - File processing
                    - Request validation"]
                end
                
                subgraph AIAgents["AI Agent System"]
                    subgraph PidginAgent["Pidgin Admin Agent"]
                        AdminPersona["Personality:
                        - Professional Pidgin
                        - HR expertise
                        - Portal knowledge"]
                        
                        AdminContext["Context Processing:
                        - Query analysis
                        - Database context
                        - Response formatting"]
                    end
                    
                    subgraph UncleAgent["Uncle HEX Agent"]
                        UnclePersona["Personality:
                        - Clear Pidgin
                        - Data expertise
                        - Analytics focus"]
                        
                        UncleContext["Context Processing:
                        - Query analysis
                        - File analysis
                        - Data interpretation"]
                    end
                end
                
                subgraph DataProcessing["Data Processing Layer"]
                    ContextBuilder["Context Builder
                    - Database integration
                    - Context formatting
                    - Response templating"]
                    
                    FileProcessor["File Processor
                    - File validation
                    - Data extraction
                    - Format conversion"]
                    
                    AIHandler["AI Service Handler
                    - Prompt engineering
                    - Response processing
                    - Error handling"]
                end
            end
        end
    end

    subgraph ExternalServices["External Services"]
        subgraph Firebase["Firebase Services"]
            DB["Realtime Database
            - Data storage
            - Real-time updates"]
            
            Storage["Cloud Storage
            - File storage
            - File retrieval"]
        end
        
        subgraph AI["AI Services"]
            GroqAI["Groq AI API
            - LLM processing
            - Response generation"]
        end
    end

    %% Frontend Flows
    AdminForm --> AdminValidation
    AdminValidation --> AdminState
    AdminState --> AdminHistory
    AdminState --> ChatAPIClient

    UncleForm --> UncleState
    FileUpload --> FileValidation
    FileSelect --> FileValidation
    FileValidation --> UncleState
    UncleState --> UncleHistory
    UncleState --> UncleAPIClient

    %% API to Backend Flows
    ChatAPIClient -->|HTTPS| NGINX
    UncleAPIClient -->|HTTPS| NGINX
    NGINX --> AdminEndpoint
    NGINX --> UncleEndpoint

    %% Backend Processing Flows
    AdminEndpoint --> PidginAgent
    UncleEndpoint --> UncleAgent
    PidginAgent --> ContextBuilder
    UncleAgent --> ContextBuilder
    UncleAgent --> FileProcessor

    %% Data Processing Flows
    ContextBuilder --> AIHandler
    FileProcessor --> AIHandler
    FileProcessor -->|File Operations| Storage
    ContextBuilder -->|Data Queries| DB

    %% AI Processing Flows
    AIHandler -->|Prompt| GroqAI
    GroqAI -->|Response| AIHandler
    AIHandler --> PidginAgent
    AIHandler --> UncleAgent

    %% Response Flows
    PidginAgent --> AdminEndpoint
    UncleAgent --> UncleEndpoint
    AdminEndpoint --> NGINX
    UncleEndpoint --> NGINX
    NGINX --> ChatAPIClient
    NGINX --> UncleAPIClient
    ChatAPIClient --> AdminState
    UncleAPIClient --> UncleState

    %% Styling
    classDef frontend fill:#dbe9f6,stroke:#2874a6
    classDef aws fill:#fbe5d6,stroke:#c55a11
    classDef docker fill:#e2f0d9,stroke:#548235
    classDef agent fill:#e1d5e7,stroke:#9673a6
    classDef processing fill:#d5e8d4,stroke:#82b366
    classDef external fill:#fff2cc,stroke:#bf9000
    classDef nginx fill:#f8cecc,stroke:#b85450
    classDef endpoint fill:#ffe6cc,stroke:#d79b00
    classDef persona fill:#e1d5e7,stroke:#9673a6

    class AdminInterface,UncleInterface,APIClients frontend
    class AWSInfra aws
    class DockerEnv docker
    class PidginAgent,UncleAgent,AdminPersona,UnclePersona agent
    class DataProcessing,ContextBuilder,FileProcessor,AIHandler processing
    class Firebase,AI,DB,Storage,GroqAI external
    class NGINX nginx
    class AdminEndpoint,UncleEndpoint endpoint
    class AdminPersona,UnclePersona persona
```

## System Components

### Frontend Application
- Admin Chatbot Interface for portal management
- Uncle HEX Interface for data analysis
- Shared API client layer

### Backend Services
- Flask server with specialized endpoints
- AI Agents for request processing
- Data and file handling

### Infrastructure
- AWS EC2 deployment
- Docker containerization
- NGINX reverse proxy

### External Services
- Firebase for data and file storage
- Groq AI for natural language processing