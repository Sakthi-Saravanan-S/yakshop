import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react"
import "./CustomTable.scss";

const CustomTable = ({ rows, columns, darkMode, defaultPageSize = 5 }) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: defaultPageSize,
    page: 0,
  });

  return (
    <div className={`custom-table-container ${darkMode ? "dark" : "light"}`}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]} // Rows per page options: 5, 10, 15
        disableSelectionOnClick
        disableRowSelectionOnClick
        disableColumnSelector
        disableColumnReorder
        initialState={{
          pagination: {
            paginationModel: { pageSize: defaultPageSize, page: 0 },
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pagination
        pageSizeOptions={[5, 10, 20]}
        autoHeight
      />
    </div>
  );
};

export default CustomTable;
