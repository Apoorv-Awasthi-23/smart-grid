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

## 📦 Installation

npm install @your-scope/smart-grid
# or
yarn add @your-scope/smart-grid



## 🧠 Basic Usage

import { useState } from "react";
import { SmartGrid } from "@your-scope/smart-grid";
import { generateUsers } from "./utils/generateSampleData";

const App = () => {
  const [data, setData] = useState(generateUsers(1000));

  const columns =
  [
    { id: "id", label: "ID", sortable: true },
    { id: "name", label: "Name", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "role", label: "Role", sortable: true },
    { id: "status", label: "Status", sortable: true },
  ];

  const handleEdit = (updatedRow, index) => {
    console.log("Edited:", updatedRow, "at index", index);
  };

  const handleDataChange = (updatedData) => {
    setData(updatedData); // Optionally update local state
  };

  return (
    <SmartGrid
      data={data}
      columns={columns}
      pageSize={50}
      theme="dark"
      onRowEdit={handleEdit}
      onDataChange={handleDataChange}
    />
  );
};


## 🛠️ Customization

## 📑 Columns Definition
{
  id: "email",
  label: "Email",
  sortable: true,
  cellRenderer: (value, row) => (
    <a href={`mailto:${value}`} className="text-blue-600 underline">{value}</a>
  )
}




