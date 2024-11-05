# HEX CSV Data Visualizer Architecture

```mermaid
flowchart TB
    FileInput[CSV File Input] --> Parser

    subgraph DataProcessing[Data Processing Layer]
        Parser[Papa Parse CSV Parser]
        FilterEngine[Filter Engine]
        DataTransformer[Data Transformer]
        StateManager[State Management]
    end

    subgraph ChartComponents[Visualization Components]
        ChartOptions[Chart Options Panel]
        
        subgraph Charts[Chart Types]
            PieChart[Pie Chart]
            BarChart[Bar Chart]
            LineChart[Line Chart]
            ScatterChart[Scatter Plot]
        end
        
        subgraph ChartFeatures[Chart Features]
            Legend[Custom Legend]
            Tooltip[Interactive Tooltip]
            Export[Chart Export]
            AxisConfig[Axis Configuration]
        end
    end

    subgraph FilterComponents[Filter System]
        FilterPanel[Filter Panel]
        FilterOperators[Filter Operators]
        ActiveFilters[Active Filters Display]
    end

    subgraph DataDisplay[Data Display]
        DataTable[Paginated Table]
        DataExport[CSV Export]
        ErrorHandler[Error Handling]
    end

    %% Data Flow
    Parser --> StateManager
    StateManager --> FilterEngine
    FilterEngine --> DataTransformer
    DataTransformer --> Charts
    DataTransformer --> DataTable

    FilterPanel --> FilterEngine
    FilterOperators --> FilterEngine
    ActiveFilters --> FilterEngine

    ChartOptions --> Charts
    Charts --> ChartFeatures
    
    %% Component Connections
    ChartFeatures --> Export
    DataTable --> DataExport
    Parser --> ErrorHandler

    %% Style Definitions
    classDef input fill:#e2f0d9,stroke:#82b366,stroke-width:2px
    classDef process fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    classDef chart fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    classDef filter fill:#fff2cc,stroke:#d6b656,stroke-width:2px
    classDef display fill:#f8cecc,stroke:#b85450,stroke-width:2px
    classDef feature fill:#e1d5e7,stroke:#9673a6,stroke-width:2px

    %% Apply Styles
    class FileInput input
    class DataProcessing,Parser,FilterEngine,DataTransformer,StateManager process
    class ChartComponents,Charts,PieChart,BarChart,LineChart,ScatterChart chart
    class FilterComponents,FilterPanel,FilterOperators,ActiveFilters filter
    class DataDisplay,DataTable,DataExport,ErrorHandler display
    class ChartFeatures,Legend,Tooltip,Export,AxisConfig,ChartOptions feature
```

## Component Details

### 1. File Input & Parsing
- CSV file validation
- Papa Parse integration
- Error handling
- File metadata tracking

### 2. Data Processing
- State management with React useState/useMemo
- Data filtering system with operators:
  - Equal/Not Equal
  - Greater/Less Than
  - Contains/Starts With/Ends With
- Data transformation for charts

### 3. Chart System
- Multiple chart types:
  - Pie Chart (distribution)
  - Bar Chart (comparison)
  - Line Chart (trends)
  - Scatter Plot (correlation)
- Features:
  - Custom legend with pagination
  - Interactive tooltips
  - Dynamic axis configuration
  - PNG export capability

### 4. Filter System
- Field selection
- Multiple operators
- Active filter display
- Filter removal

### 5. Data Display
- Paginated data table
- Filtered data export
- Loading states
- Error messaging

### 6. Features
- Real-time updates
- Responsive design
- Data validation
- Export capabilities

### 7. State Management
- React state hooks
- Memoized computations
- Callback handling
- Reference management

## Technical Implementation
- React with TypeScript
- Recharts for visualization
- Papa Parse for CSV handling
- Bootstrap for styling
- File API for exports

This architecture ensures:
1. Efficient data processing
2. Flexible visualization options
3. Robust filter system
4. Seamless user experience
5. Error handling
6. Export functionality