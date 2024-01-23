import React, { useEffect, useMemo, useState } from "react"; // Added import for useEffect, useMemo, useState
import { useSelector } from "react-redux";

const TransactionsPage = () => {
  const transactions = useSelector((state) => state.transaction.transactions);
  const [filter, setFilter] = useState(""); // State for filtering
  const [sort, setSort] = useState("date"); // State for sorting
  const [search, setSearch] = useState(""); // State for searching

  // Function to handle the sorting of transactions
  const sortedTransactions = useMemo(() => {
    // Sorting logic
    return [...transactions].sort((a, b) => {
      if (sort === "date") {
        return new Date(b.date) - new Date(a.date); // newest first
      } else if (sort === "amount") {
        return b.amount - a.amount; // highest first
      }
      return 0;
    });
  }, [transactions, sort]);

  // Function to handle the filtering of transactions
  const filteredTransactions = useMemo(() => {
    // Filtering logic
    return sortedTransactions.filter((transaction) => {
      return transaction.description
        .toLowerCase()
        .includes(filter.toLowerCase());
    });
  }, [sortedTransactions, filter]);

  const searchTransactions = transactions.filter((transaction) => {
    // Search logic
    return transaction.description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <h1>Transactions</h1>
      <input
        type="text"
        placeholder="Search by description..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Search input field
      />
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        {" "}
        // Sort selection field
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>
      <div>
        {searchTransactions.map(
          (
            transaction,
            index // Render searchTransactions instead of transactions
          ) => (
            <div
              key={index} // Changed from transaction.referenceNumber to index
              className="bg-gray-800 text-gray-300 p-4 rounded-lg shadow-md mb-4" // Added styling
            >
              <p>Date: {transaction.date}</p>
              <p>Description: {transaction.description}</p>
              <p>Reference Number: {transaction.referenceNumber}</p>
              <p>Amount: {transaction.amount}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
