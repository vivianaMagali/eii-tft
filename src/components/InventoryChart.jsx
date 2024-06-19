import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const InventoryChart = ({ inventoryData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Cantidad",
        data: inventoryData,
        backgroundColor: "rgba(54, 223, 235, 0.897)",
      },
    ],
  });

  useEffect(() => {
    if (inventoryData) {
      const labels = inventoryData.map((item) => item.name);
      const data = inventoryData.map((item) => item.amountInventory);

      setChartData({
        labels,
        datasets: [
          {
            label: "Cantidad",
            data,
            backgroundColor: "rgba(54, 223, 235, 0.897)",
          },
        ],
      });
    }
  }, [inventoryData]);

  const deleteProduct = (uidInventory) => {
    console.log("uidInventory", uidInventory);
  };

  const updateProduct = (product) => {
    console.log("product", product);
  };

  return (
    <>
      <div className="flex justify-center font-bold mt-10">
        <h1>Gráfica de inventario de productos</h1>
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg mx-5">
        <Bar
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
      <table className="table-auto p-4 bg-white shadow-md rounded-lg mx-5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ingredientes</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Tipo</th>
            <th>Productor</th>
            <th>Eliminar</th>
            <th>Modificar</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((product) => (
            <tr>
              <td>{product.name}</td>
              <td>{product.ingredients}</td>
              <td>{product.price}</td>
              <td>{product.amountInventory}</td>
              <td>{product.type}</td>
              <td>{product.producer}</td>
              <td>
                <button onClick={deleteProduct(product.uid)}>Eliminar</button>
              </td>
              <td>
                <button onClick={updateProduct(product)}>Modificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default InventoryChart;
