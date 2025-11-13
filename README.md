# Dynamatics Frontend

Dynamatics is **FlowGraph Analytics Builder**. It's a React-based application that allows
**users to build custom analytics workflows** using a visual node-based interface. Users can
combine **data transformation nodes** (filter, merge, sort, group, etc.) with
**visualization nodes** (bar charts, line charts, pie charts, tables, etc.) to
create dynamic, interactive analytics dashboards.

![alt text](dynamatics.png)

## **Features**

- **Drag-and-drop flow builder** for creating analytics pipelines.
- **Data source nodes**: At the time of writing, we use these to simulate logs but
can be written as connectors to external services in future
- **Data transformation nodes**:
  - Filter + Xomplex boolean logic support - nested `AND` and `OR`
  - Sort
  - Merge
  - Group By. With support
    - For multiple types `inner`, `outer`, `left` and `right`
    - For multiple indexing
- **Visualization nodes**:
  - Bar chart
  - Line chart
  - Pie chart
  - Data table
- **Dynamic linking of nodes** to create complex analytics workflows.

## **Tech Stack**

- **Frontend**: React, TypeScript, TailwindCSS
- **Node Graph Engine**: ShadowCN
- **Routing**: React Router DOM
- **Deployment**: Contentstack Launch
- **State Management**: Context API
- **Visualization**: Recharts
- **Backend (optional)**: FastAPI for Flow and Dashboard API

---

## **Installation**

1. Clone the repository

```bash
git clone https://github.com/your-org/flowgraph-analytics.git
cd flowgraph-analytics
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set environment variables

```bash
# The API server for dynamatics. More info here :
# https://github.com/ninja011003/dynamatics-backend
VITE_API_URL=http://localhost:8000
```

4. Run locally

```bash
npm start
# or
yarn start
```

App should now be running at http://localhost:3000.

## Available Nodes

### Data Transformation Nodes

| Node     | Description                         |
| -------- | ----------------------------------- |
| Filter   | Filter rows based on conditions     |
| Sort     | Sort rows ascending/descending      |
| Merge    | Combine data from multiple nodes    |
| Group By | Group data and calculate aggregates |

### Visualization Nodes

| Node       | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| Bar Chart  | Render bar charts                                                   |
| Line Chart | Render trends over time                                             |
| Pie Chart  | Show proportion of categories                                       |
| Data Table | Tabular data view with search, pagination and column toggle support |