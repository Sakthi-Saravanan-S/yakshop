import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHerd } from "../store/stockSlice";
import CustomTable from "../components/CustomTable";
import {
  calculateOverallMilkProductionPerYak,
  calculateWoolStock,
  calculateMilkProductionPerDay,
  calculateShaveFrequency,
} from "../utils";
import "./HerdManagement.scss";

const HerdManagement = () => {
  const dispatch = useDispatch();
  const herd = useSelector((state) => state.stock.herd);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    dispatch(getHerd());
  }, [dispatch]);

  const columns = [
    { field: "name", headerName: "Name", width: 150, resizable: false },
    { field: "age", headerName: "Age (in Years and Days)", width: 200, resizable: false },
    { field: "milkProductionPerDay", headerName: "Milk Production (Liters/Day)", width: 220, align: "right", resizable: false },
    { field: "totalMilkProduction", headerName: "Total Milk Production (Liters)", width: 240, align: "right", resizable: false },
    { field: "shaveFrequency", headerName: "Shave Frequency", width: 180, resizable: false },
    { field: "totalWoolProduction", headerName: "Total Wool Production (Skins)", width: 220, align: "right", resizable: false },
  ];

  const rows = herd.map((yak, index) => {
    const ageInDays = yak.age * 100;
    return {
      id: index + 1,
      name: yak.name,
      age: `${Math.floor(ageInDays / 100)} Years, ${ageInDays % 100} Days`,
      milkProductionPerDay: `${calculateMilkProductionPerDay(ageInDays).toFixed(2)}L`,
      totalMilkProduction: `${calculateOverallMilkProductionPerYak(ageInDays).toFixed(2)}L`,
      shaveFrequency: `${calculateShaveFrequency(ageInDays)} Day/Shave`,
      totalWoolProduction: calculateWoolStock(ageInDays),
    };
  });

  return (
    <div className={`herd-management-container ${darkMode ? "dark" : "light"}`}>
      {herd.length > 0 ? (
        <CustomTable rows={rows} columns={columns} darkMode={darkMode} />
      ) : (
        <p className="loading-message">Loading herd data...</p>
      )}
    </div>
  );
};

export default HerdManagement;
