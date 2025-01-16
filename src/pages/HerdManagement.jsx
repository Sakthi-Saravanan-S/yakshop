import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHerd } from "../store/stockSlice";
import { calculateMilkProduction, calculateWoolStock } from "../utils";
import "./HerdManagement.scss";

const HerdManagement = () => {
  const dispatch = useDispatch();
  const herd = useSelector((state) => state.stock.herd);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    dispatch(getHerd());
  }, [dispatch]);

  return (
    <div className={`herd-management-container ${darkMode ? "dark" : "light"}`}>
      {herd.length > 0 ? (
        <div>
          <table className={`herd-table ${darkMode ? "dark" : "light"}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age (in Years and Days)</th>
                <th>Milk Production (Liters/Day)</th>
                <th>Wool Stock (Skins)</th>
              </tr>
            </thead>
            <tbody>
              {herd.map((yak) => {
                const ageInDays = yak.age * 100;
                return (
                  <tr key={yak.name}>
                    <td>{yak.name}</td>
                    <td className="age">{`${Math.floor(
                      ageInDays / 100
                    )} Years, ${ageInDays % 100} Days`}</td>
                    <td className="milk-production">
                      {calculateMilkProduction(ageInDays).toFixed(2)}
                    </td>
                    <td className="wool-stock">
                      {calculateWoolStock(ageInDays)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="loading-message">Loading herd data...</p>
      )}
    </div>
  );
};

export default HerdManagement;
