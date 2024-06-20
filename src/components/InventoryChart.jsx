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

  return (
    <>
      <div className="flex justify-center text-xl font-bold mt-10">
        <h1>Gráfica de inventario de productos</h1>
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg mx-5">
        <Bar
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </>
  );
};

export default InventoryChart;
