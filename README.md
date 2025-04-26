# ⚡ SmartGrid

> A high-performance, customizable React data grid with virtual scrolling, sorting, filtering, inline editing, pagination, and theming.

---

## ✨ Features

- 🚀 Virtualized rendering using `react-window`
- 🔍 Column-based filtering
- ↕️ Sorting (ascending/descending)
- ✏️ Inline editing with Save & Cancel
- 📤 Export as CSV or JSON
- 🎨 Light/Dark theme support & toggle
- 🔁 Toggleable pagination
- 🎥 Animated skeleton loaders via `framer-motion`
- 🔗 Custom cell renderers
- 📡 `onDataChange` prop to notify parent of full updated dataset

---

## 🧠 Basic Usage

import React, { useState } from 'react';
import { SmartGrid } from '@your-scope/smart-grid';
import { generateUsers } from './utils/generateSampleData';

const App = () => {
  const [data, setData] = useState(generateUsers(1000));

  const columns = [
    { id: 'id', label: 'ID', sortable: true },
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'role', label: 'Role', sortable: true },
  ];

  return (
    <SmartGrid
      data={data}
      columns={columns}
      onDataChange={setData}
      pagination
      theme="light"
    />
  );
};

export default App;


## 🧩 Props

### | Prop           | Type       | Default     | Description                                        |
|----------------|------------|-------------|----------------------------------------------------|
| `data`         | `Array`    | `[]`        | The dataset to display in the grid.                |
| `columns`      | `Array`    | `[]`        | Configuration for each column (see below).         |
| `onDataChange` | `Function` | `undefined` | Callback invoked when data is updated.             |
| `pagination`   | `Boolean`  | `false`     | Enables or disables pagination.                    |
| `theme`        | `String`   | `'light'`   | Sets the theme; options: `'light'` or `'dark'`.    |


## 🧱 Column Configuration

### | Property     | Type       | Description                                                  |
|--------------|------------|--------------------------------------------------------------|
| `id`         | `String`   | Unique identifier for the column (used to access row data).  |
| `label`      | `String`   | Display name for the column header.                          |
| `sortable`   | `Boolean`  | Enables sorting for the column.                              |
| `filterable` | `Boolean`  | Enables filtering for the column.                            |
| `editable`   | `Boolean`  | Allows inline editing for cells in this column.              |
| `render`     | `Function` | Custom render function for the cell. Receives the row data.  |





## 🎨 Theming

SmartGrid supports light and dark themes. Set the theme prop to 'light' or 'dark' to switch themes.


## 📤 Data Export
SmartGrid allows exporting the current dataset to CSV or JSON formats. Integration of export buttons or triggers can be implemented as needed.


## 🔧 Custom Cell Renderers
To customize the rendering of a specific column's cells, provide a render function in the column configuration:


  id: 'actions',
  label: 'Actions',
  render: (row) => (
    <button onClick={() => handleEdit(row.id)}>Edit</button>
  )


    
  

