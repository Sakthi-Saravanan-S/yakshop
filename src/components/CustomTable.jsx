import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BiDotsVerticalRounded } from "react-icons/bi";
import "./CustomTable.scss";

const CustomTable = ({
  rows,
  columns,
  darkMode,
  defaultPageSize = 5,
  loadActionColumns = false,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: defaultPageSize,
    page: 0,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCancelOrder = () => {
    console.log(`Cancel order for row ID: ${selectedRow.id}`);
    handleMenuClose();
  };

  const markOrderAsComplete = () => {
    console.log(`Complete order for row ID: ${selectedRow.id}`);
    handleMenuClose();
  };

  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => (
      <>
        <IconButton
          onClick={(event) => handleMenuClick(event, params.row)}
          size="small"
        >
          <BiDotsVerticalRounded size={20} /> {/* React Icon */}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleCancelOrder}>Cancel Order</MenuItem>
          <MenuItem onClick={markOrderAsComplete}>Mark as complete</MenuItem>
        </Menu>
      </>
    ),
  };

  const updatedColumn = loadActionColumns
    ? [...columns, actionColumn]
    : [...columns];

  return (
    <div className={`custom-table-container ${darkMode ? "dark" : "light"}`}>
      <DataGrid
        rows={rows}
        columns={updatedColumn}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
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
