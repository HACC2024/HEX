# HEX CSV Data Visualizer Architecture

This document outlines the architecture of the HEX CSV Data Visualizer tool, including its component hierarchy, data flow, and key features.

```mermaid
flowchart TB
    subgraph Frontend["CSV Data Visualizer Frontend"]
        subgraph MainComponent["CsvReader Component"]
            FileInput["File Input Handler
            - CSV validation
            - File processing
            - Error handling"]
            
            subgraph DataProcessing["Data Processing Layer"]
                Parser["Papa Parse
                - CSV parsing
                - Header detection
                - Data validation"]
                
                FilterEngine["Filter Engine
                - Field filtering
                - Operator processing
                - Value matching"]
                
                DataTransformer["Data Transformer
                - Data aggregation
                - Format conversion
                - Type checking"]
            end
            
            subgraph Visualization["Visualization Components"]
                ChartOptions["Chart Options Panel
                - Chart type selection
                - Axis configuration
                - Color customization"]
                
                subgraph Charts["Chart Components"]
                    PieChart["Pie Chart
                    - Data distribution
                    - Color coding
                    - Interactive legend"]
                    
                    BarChart["Bar Chart
                    - Comparison view
                    - Axis scaling
                    - Grid display"]
                    
                    LineChart["Line Chart
                    - Trend analysis
                    - Point markers
                    - Smooth curves"]
                    
                    ScatterChart["Scatter Plot
                    - Correlation view
                    - Point distribution
                    - Axis mapping"]
                end
                
                ChartLegend["Custom Legend
                - Pagination
                - Value formatting
                - Color indicators"]
            end
            
            subgraph DataDisplay["Data Display"]
                DataTable["Data Table
                - Pagination
                - Sorting
                - Row display"]
                
                ExportTools["Export Tools
                - CSV export
                - Chart export
                - PNG generation"]
            end
        end
    end

    subgraph Libraries["External Libraries"]
        Recharts["Recharts
        - Chart rendering
        - Responsiveness
        - Animations"]
        
        PapaParse["Papa Parse
        - CSV parsing
        - Data validation"]
        
        Bootstrap["Bootstrap
        - UI components
        - Styling
        - Layout"]
    end

    %% Data Flow
    FileInput --> Parser
    Parser --> FilterEngine
    FilterEngine --> DataTransformer
    DataTransformer --> Charts
    DataTransformer --> DataTable
    ChartOptions --> Charts
    Charts --> ChartLegend
    Charts --> ExportTools

    %% Library Integration
    Recharts --> Charts
    PapaParse --> Parser
    Bootstrap --> MainComponent

    %% Styling
    classDef frontend fill:#dbe9f6,stroke:#2874a6,color:#2C5282
    classDef component fill:#e2f0d9,stroke:#548235,color:#2C5282
    classDef library fill:#fff2cc,stroke:#bf9000,color:#2C5282
    classDef chart fill:#e1d5e7,stroke:#9673a6,color:#2C5282
    classDef processing fill:#f8cecc,stroke:#b85450,color:#2C5282

    class Frontend frontend
    class MainComponent,DataDisplay,Visualization component
    class Libraries,Recharts,PapaParse,Bootstrap library
    class Charts,PieChart,BarChart,LineChart,ScatterChart chart
    class DataProcessing,Parser,FilterEngine,DataTransformer processing

```

## Component Overview

### Main Components
1. **File Input Handler**
   - CSV file validation
   - File processing
   - Error handling
   - File metadata management

2. **Data Processing Layer**
   - Papa Parse integration for CSV parsing
   - Data validation and cleaning
   - Filter engine for data manipulation
   - Data transformation for visualization

3. **Visualization Components**
   - Chart Options Panel for customization
   - Multiple chart types (Pie, Bar, Line, Scatter)
   - Custom legend with pagination
   - Interactive tooltips and animations

4. **Data Display**
   - Paginated data table
   - Export functionality
   - Data filtering interface
   - Row display options

### Features
1. **Data Processing**
   - CSV parsing and validation
   - Dynamic filtering system
   - Data aggregation
   - Type conversion

2. **Visualization**
   - Multiple chart types
   - Customizable colors
   - Axis configuration
   - Legend management

3. **Export Capabilities**
   - Filtered CSV export
   - Chart image export
   - PNG generation
   - Data table export

4. **User Interface**
   - Responsive design
   - Interactive components
   - Error handling
   - Loading states

### External Libraries
- Recharts for chart rendering
- Papa Parse for CSV handling
- Bootstrap for UI components
- React for component management

This architecture ensures:
1. Efficient data processing
2. Flexible visualization options
3. User-friendly interface
4. Robust error handling
5. Scalable component structure