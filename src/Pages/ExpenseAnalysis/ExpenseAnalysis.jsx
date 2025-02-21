import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { domain } from "../../Constants/Constants";
const ExpenseAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const User_data = JSON.parse(sessionStorage.getItem("user_data"));
        const accessToken = User_data?.access;
        const userID = User_data?.user.id;

        const response = await axios.get(`${domain}/exp/user-expenses/${userID}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = response?.data || [];
        setExpenses(data);

        // Process Pie Chart Data (Category-wise total)
        const categoryTotals = {};
        data.forEach((expense) => {
          const amount = parseFloat(expense.amount);
          if (!isNaN(amount)) {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + amount;
          }
        });

        const pieChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
          name: category,
          value: amount,
        }));
        setPieData(pieChartData);

        // Process Bar Chart Data (Daily Expenses)
        const dailyTotals = {};
        data.forEach((expense) => {
          const date = expense.payment_date ? expense.payment_date.split("T")[0] : "Unknown Date";
          const amount = parseFloat(expense.amount);
          if (!isNaN(amount)) {
            dailyTotals[date] = (dailyTotals[date] || 0) + amount;
          }
        });

        const barChartData = Object.entries(dailyTotals).map(([date, amount]) => ({
          date,
          amount,
        }));
        setBarData(barChartData.sort((a, b) => new Date(a.date) - new Date(b.date)));

        // Process Line Chart Data (Trend Over Time)
        setLineData(barChartData);

      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
      setLoading(false);
    }

    fetchExpenses();
  }, []);

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF7"];

  return (
    <div className="p-6 w-full">
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Filters</h2>
        {/* Add dropdowns, date pickers, etc. here */}
      </div>

      {/* Graph Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart - Expense by Category */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center">Expenses by Category</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading Pie Chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹ ${value} `} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart - Daily Expenses */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center">Daily Expenses</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading Bar Chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹ ${value}`} />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line Graph - Expense Trend */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-center">Expense Trend Over Time</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading Line Graph...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹ ${value}`} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
