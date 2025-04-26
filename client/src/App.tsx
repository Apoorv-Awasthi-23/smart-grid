//@ts-nocheck
import { useState } from "react";
import SmartGrid from "./smartGrid.tsx";
import { generateUsers } from "./utils/generateSampleData";

const initialData = generateUsers(10000);
const columns = [
  { id: "id", label: "ID", sortable: true },
  { id: "name", label: "Name", sortable: true },
  { id: "email", label: "Email", sortable: true },
  { id: "role", label: "Role", sortable: true },
  { id: "status", label: "Status", sortable: true },
];

const pageSize = 200;
const theme = "dark";

const App = () => {
  const [data, setData] = useState(initialData);

  const handleEdit = (row: any, rowIndex: number) => {
    console.log("Editing row:", row, "at index:", rowIndex);
  };

  const handleDataChange = (updatedData: typeof data) => {
    setData(updatedData); // Persist updated dataset
    console.log("Updated dataset:", updatedData);
  };

  return (
    <SmartGrid
      data={data}
      columns={columns}
      pageSize={pageSize}
      theme={theme}
      onRowEdit={handleEdit}
      onDataChange={handleDataChange}
    />
  );
};

export default App;
