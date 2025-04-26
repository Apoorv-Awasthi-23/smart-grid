# ⚡ SmartGrid

> A high-performance, customizable React data grid with virtual scrolling, sorting, filtering, inline editing, pagination, and theming.

---

## 🌟 Overview
SmartDataGrid is a reusable and customizable data grid component designed for modern frontend applications. Created to be published as an npm package, it offers a developer-friendly API for rendering dynamic tables with sorting, filtering, pagination, theming, animations, and more.

Ideal for dashboards, admin panels, and analytics interfaces.

## ✨ Features

### ✅ Core Features
### Dynamic Columns & Rows
Accepts JSON-based row data and column definitions via props.

#### Sorting & Filtering
Supports column-wise sorting and optional filters.

#### Client-side Pagination
Includes page size control and easy navigation.

#### Responsive Layout
Mobile-first, flexible grid that works on all screen sizes.

#### Custom Cell Renderers
Inject custom React components inside any table cell.

#### Theming
Supports Light/Dark mode and customizable primary colors.

#### Smooth Animations
Uses Framer Motion for row transitions and skeleton loaders.

## 🧪 Optional Power-Ups (Implemented)
#### ✅ Inline Editing
Editable cells with Save/Cancel logic.

##### ✅ Export Functionality
Download data as CSV or JSON.

#### ✅ Virtual Scrolling
Efficiently handles large datasets using react-window.

---

## Example

import React, { useState } from 'react';<br/> 
import { SmartGrid } from '/smartGrid';<br/>
import { generateUsers } from './utils/generateSampleData';<br/>
<br/>
const App = () => { <br/>
  const [data, setData] = useState(generateUsers(1000)); <br/>

  const columns = [ <br/>
    { id: 'id', label: 'ID', sortable: true }, <br/>
    { id: 'name', label: 'Name', sortable: true, filterable: true, editable: true }, <br/>
    { id: 'email', label: 'Email', sortable: true, editable: true }, <br/>
    { id: 'role', label: 'Role', sortable: true }, <br/>
  ]; <br/>
<br/>
  return ( <br/>
    <SmartGrid <br/>
      data={data} <br/>
      columns={columns} <br/>
      onDataChange={setData} <br/>
      pagination <br/>
      theme="light" <br/>
    /> <br/>
  ); <br/>
}; <br/>
<br/>
export default App; <br/>



## 🧩 Props

#### data (Array, default: [])
The dataset to display in the grid.

#### columns (Array, default: [])
Configuration for each column (see column configuration below).

#### onDataChange (Function, default: undefined)
Callback function triggered when any row or cell is updated.

#### pagination (Boolean, default: false)
Enables or disables pagination in the grid.

#### theme (String, default: 'light')
Sets the grid theme. Available options: 'light' or 'dark'.


## 🧱 Column Configuration

#### id (String)
Unique identifier for the column. Used to access the corresponding key in each row.

#### label (String)
Display name shown in the column header.

#### sortable (Boolean)
Enables sorting for this column.

#### filterable (Boolean)
Enables filtering for this column.

#### editable (Boolean)
Allows inline editing of cells under this column.

#### render (Function)
Custom cell rendering function. Receives the row data as a parameter and returns JSX.



## 🎨 Theming

SmartGrid supports light and dark themes. Set the theme prop to 'light' or 'dark' to switch themes.


## 📤 Data Export
SmartGrid allows exporting the current dataset to CSV or JSON formats. Integration of export buttons or triggers can be implemented as needed.


## 🔧 Custom Cell Renderers
To customize the rendering of a specific column's cells, provide a render function in the column configuration:

<br/>

  id: 'actions', <br/>
  label: 'Actions', <br/>
  render: (row) => ( <br/>
    <button onClick={() => handleEdit(row.id)}>Edit</button> <br/>
  ) <br/>


  
## 🧪 Animations & Responsiveness
All rows animate on load-in using Framer Motion.

Skeleton loaders appear during initial data load.

Responsive design works across all devices.

## 📤 Export Options
You can allow users to download the currently visible dataset via: <br/>
<br/>
exportToCSV(data, fileName); <br/>
exportToJSON(data, fileName); <br/>


    
  

