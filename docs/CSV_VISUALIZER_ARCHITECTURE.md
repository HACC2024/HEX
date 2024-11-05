# HEX CSV Data Visualizer Architecture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontSize': '16px',
    'fontFamily': 'arial',
    'lineColor': '#334155',
    'primaryColor': '#2563eb',
    'primaryTextColor': '#1e293b',
    'primaryBorderColor': '#1e40af',
    'secondaryColor': '#475569',
    'tertiaryColor': '#94a3b8'
  }
}}%%

flowchart TB
    %% Main Components
    FileInput["File Input System"] --> DataProcessor
    
    subgraph DataProcessor["Data Processing Layer"]
        direction TB
        Parser["CSV Parser"] --> FilterSystem["Filter System"]
        FilterSystem --> Transformer["Data Transformer"]
    end
    
    subgraph ChartSystem["Visualization System"]
        direction TB
        ChartOptions["Chart Options Panel"] --> Charts
        
        subgraph Charts["Chart Components"]
            direction LR
            Pie["Pie Chart"]
            Bar["Bar Chart"]
            Line["Line Chart"]
            Scatter["Scatter Plot"]
        end
        
        Charts --> Legend["Interactive Legend"]
    end
    
    subgraph Display["Data Display System"]
        Table["Data Table"] --> Export["Export Module"]
    end
    
    %% External Libraries
    subgraph Libraries["Core Libraries"]
        direction LR
        Recharts["Recharts"]
        Papa["Papa Parse"]
        Bootstrap["Bootstrap"]
    end
    
    %% Main Data Flow
    DataProcessor --> ChartSystem
    DataProcessor --> Display
    ChartSystem --> Export
    
    %% Library Connections
    Papa -..-> Parser
    Recharts -..-> Charts
    Bootstrap -..-> Display
    
    %% Styling
    classDef default fill:#f8fafc,stroke:#475569,color:#0f172a,stroke-width:2px
    classDef processor fill:#dbeafe,stroke:#2563eb,color:#1e40af,stroke-width:2px
    classDef charts fill:#f0fdf4,stroke:#16a34a,color:#166534,stroke-width:2px
    classDef display fill:#fef2f2,stroke:#dc2626,color:#991b1b,stroke-width:2px
    classDef libraries fill:#fef3c7,stroke:#d97706,color:#92400e,stroke-width:2px
    classDef mainFlow stroke:#334155,stroke-width:3px,color:#0f172a
    
    %% Apply styles
    class FileInput,Legend default
    class DataProcessor,Parser,FilterSystem,Transformer processor
    class ChartSystem,ChartOptions,Charts,Pie,Bar,Line,Scatter charts
    class Display,Table,Export display
    class Libraries,Recharts,Papa,Bootstrap libraries
    
    %% Update linkStyles for better visibility
    linkStyle default stroke:#334155,stroke-width:2px
    %% External library connections
    linkStyle 10,11,12 stroke:#737373,stroke-width:2px,stroke-dasharray:5
```

## Architecture Components

### 1. Input System
- File validation & processing
- Error handling
- Initial data parsing

### 2. Data Processing Layer
- **Parser**: CSV data parsing and validation
- **Filter System**: Advanced data filtering
- **Transformer**: Data format conversion

### 3. Visualization System
- **Chart Options**: Configuration controls
- **Charts**: Multiple visualization types
  - Pie Chart: Distribution views
  - Bar Chart: Comparative analysis
  - Line Chart: Trend analysis
  - Scatter Plot: Correlation views
- **Legend**: Interactive data reference

### 4. Display System
- **Data Table**: Paginated data display
- **Export Module**: Multiple export formats

### 5. Core Libraries
- **Recharts**: Chart rendering
- **Papa Parse**: CSV processing
- **Bootstrap**: UI components

## Data Flow
1. CSV File Input → Parser
2. Parsed Data → Filter System
3. Filtered Data → Transformer
4. Transformed Data → Charts/Table
5. Visualization → Export

## Features
- Real-time data processing
- Multiple chart types
- Interactive filtering
- Export capabilities
- Responsive design

## Technical Details
- React-based components
- TypeScript implementation
- Modular architecture
- Responsive design
- Error handling

## Security
- File type validation
- Data sanitization
- Size limitations
- Error boundaries

The system provides:
1. Efficient data handling
2. Flexible visualization
3. User-friendly interface
4. Export capabilities
5. Robust error handling