import SmartGrid from "./smartGrid.tsx"

const data = [
  { id: 1, name: "Alice", balance: 1200 },
  { id: 2, name: "Bob", balance: 900 },
  { id: 3, name: "Charlie", balance: 1600 },
];

const columns = [
  { id: "id", label: "ID", sortable: true },
  { id: "name", label: "Name" },
  { id: "balance", label: "Balance", sortable: true },
];
const pageSize = 2;
const theme = "dark";
const App = () => {

  const handleEdit = (row: any, rowIndex: number) => {
    console.log("Editing row:", row, "at index:", rowIndex);
  };
  return (
    <div>
      <SmartGrid
        data={data}
        columns={columns}
        pageSize={pageSize}
        theme={theme}
        onRowEdit={handleEdit}
      
      />
      </div>
  )
}

export default App