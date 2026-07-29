import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import aiAPI from "../api/aiApi";

import {
  FaWallet,
  FaBriefcase,
  FaChartLine,
  FaArrowTrendUp,
  FaCoins,
  FaPen,
  FaTrash,
} from "react-icons/fa6";
import Footer from "../components/Footer";

function Income() {

  // Logged in user id
  const userId = Number(localStorage.getItem("userId"));

  // Income List
  const [incomes, setIncomes] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Edit Modal
  const [editModal, setEditModal] = useState(false);

  // Selected Income
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    description: "",
    incomeDate: ""
  });

  useEffect(() => {

    if (userId) {

      fetchIncome();

    }

  }, [userId]);

  // ===========================
  // GET INCOME
  // ===========================

  const fetchIncome = async () => {

    try {

      setLoading(true);

      console.log("User Id :", userId);

      const response =
        await aiAPI.get(
          `/api/income/${userId}`
        );

      console.log("Income :", response.data);

      setIncomes(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  // ===========================
  // INPUT CHANGE
  // ===========================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  // ===========================
  // ADD INCOME
  // ===========================

  const addIncome = async (e) => {

    e.preventDefault();

    try {

      const response =
        await aiAPI.post(

          `/api/income/${userId}`,

          formData

        );

      alert(response.data);

      setShowModal(false);

      setFormData({

        source: "",

        amount: "",

        description: "",

        incomeDate: ""

      });

      fetchIncome();

    } catch (error) {

      console.log(error);

      alert("Unable To Add Income");

    }

  };

  // ===========================
  // OPEN EDIT
  // ===========================

  const openEdit = (income) => {

    setSelectedIncome(income);

    setFormData({

      source:
        income.source,

      amount:
        income.amount,

      description:
        income.description,

      incomeDate:
        income.incomeDate

    });

    setEditModal(true);

  };

  // ===========================
  // UPDATE INCOME
  // ===========================

  const updateIncome = async (e) => {

    e.preventDefault();

    try {

      const response =
        await aiAPI.put(

          `/api/income/${selectedIncome.incomeId}`,

          formData

        );

      alert(response.data);

      setEditModal(false);

      fetchIncome();

    } catch (error) {

      console.log(error);

    }

  };

  // ===========================
  // DELETE INCOME
  // ===========================

  const deleteIncome = async (incomeId) => {

    if (!window.confirm("Delete this income?")) {

      return;

    }

    try {

      const response =
        await aiAPI.delete(

          `/api/income/${incomeId}`

        );

      alert(response.data);

      fetchIncome();

    } catch (error) {

      console.log(error);

    }

  };

  // ===========================
  // TOTAL INCOME
  // ===========================

  const totalIncome =
    incomes.reduce(

      (sum, income) =>

        sum + Number(income.amount),

      0

    );
    
  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
              Income Analytics
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
              Monitor salary, business and passive income
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="
            w-full
            lg:w-auto
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            px-8
            py-4
            rounded-2xl
            font-bold
            text-base
            lg:text-lg
            shadow-2xl
            hover:scale-105
            transition
            "
          >
            + Add Income
          </button>
        </div>

        {/* SUMMARY CARD */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div
            className="
            xl:col-span-2
            bg-gradient-to-br
            from-[#11183C]
            to-[#1B2559]
            rounded-[35px]
            p-8
            border
            border-[#26316A]
            "
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-lg">
                  Total Income
                </p>
                <h1 className="text-6xl font-bold text-green-400 mt-5">
                  ₹{totalIncome.toLocaleString()}
                </h1>
                <div className="flex items-center gap-3 mt-6 text-green-400">
                  <FaArrowTrendUp />
                  <span>
                    {incomes.length} Income Records
                  </span>
                </div>
              </div>
              <div
                className="
                w-28
                h-28
                rounded-full
                bg-gradient-to-r
                from-green-400
                to-emerald-600
                flex
                items-center
                justify-center
                text-5xl
                "
              >
                <FaWallet />
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div
            className="
            bg-[#11183C]
            rounded-[35px]
            p-8
            border
            border-[#26316A]
            "
          >
            <h1 className="text-3xl font-bold">
              Income Summary
            </h1>
            <div className="space-y-6 mt-8">
              <div className="flex justify-between">
                <span>Total Records</span>
                <span className="font-bold">
                  {incomes.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="text-green-400 font-bold">
                  ₹{totalIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#11183C] mt-8 p-6 rounded-[30px]">
          <h1 className="text-3xl font-bold mb-8">
            Income History
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-4 text-left">
                    Source
                  </th>
                  <th className="text-left">
                    Amount
                  </th>
                  <th className="text-left">
                    Description
                  </th>
                  <th className="text-left">
                    Date
                  </th>
                  <th className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : incomes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10"
                    >
                      No Income Found
                    </td>
                  </tr>
                ) : (
                  incomes.map((income) => (
                    <tr
                      key={income.incomeId}
                      className="border-b border-[#1B2559]"
                    >
                      <td className="py-5">
                        {income.source}
                      </td>
                      <td className="text-green-400 font-bold">
                        ₹{income.amount}
                      </td>
                      <td>
                        {income.description}
                      </td>
                      <td>
                        {income.incomeDate}
                      </td>
                      <td>
                        <div className="flex justify-center gap-5">
                          <button
                            onClick={() => openEdit(income)}
                          >
                            <FaPen className="text-blue-400" />
                          </button>
                          <button
                            onClick={() =>
                              deleteIncome(income.incomeId)
                            }
                          >
                            <FaTrash className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* ADD INCOME MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#11183C] w-[500px] rounded-3xl p-8">
              <h1 className="text-3xl font-bold mb-8">
                Add Income
              </h1>
              <form onSubmit={addIncome} className="space-y-5">
                <input
                  type="text"
                  name="source"
                  placeholder="Income Source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <input
                  type="date"
                  name="incomeDate"
                  value={formData.incomeDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 py-3 rounded-xl font-bold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-red-500 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#11183C] w-[500px] rounded-3xl p-8">
              <h1 className="text-3xl font-bold mb-8">
                Update Income
              </h1>
              <form onSubmit={updateIncome} className="space-y-5">
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <input
                  type="date"
                  name="incomeDate"
                  value={formData.incomeDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0D1335] p-4 rounded-xl outline-none"
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 py-3 rounded-xl font-bold"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="flex-1 bg-red-500 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FOOTER - CONSTANT */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Income;