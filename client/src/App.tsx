import SmartGrid from "./smartGrid.tsx"
import { generateUsers } from "./utils/generateSampleData";


const data = generateUsers(1000);

const columns = [
  { id: "id", label: "ID", sortable: true },
  { id: "name", label: "Name", sortable: true },
  { id: "email", label: "Email", sortable: true },
  { id: "role", label: "Role", sortable: true },
  { id: "status", label: "Status", sortable: true },
];

const pageSize = 2;
const theme = "dark";
const App = () => {

  const handleEdit = (row: any, rowIndex: number) => {
    console.log("Editing row:", row, "at index:", rowIndex);
  };
  return (
    <>
      <SmartGrid
        data={data}
        columns={columns}
        pageSize={pageSize}
        theme={theme}
        onRowEdit={handleEdit}
        height={0}
        width="100%"      
      />
      </>
  )
}

export default App