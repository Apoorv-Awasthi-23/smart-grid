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


    
  

