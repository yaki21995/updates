import React, { useMemo, useState, useDispatch } from "react"; // Added import for useMemo, useDispatch
import { useSelector } from "react-redux";
import { addInvoice } from "../actions/invoiceActions"; // Import addInvoice action

const InvoicesPage = () => {
  // ... existing state and function definitions
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    creationDate: new Date(),
    referenceNumber: `INV-${new Date()} - ${Math.floor(Math.random() * 10000)}`,
  });
  const transactions = useSelector((state) => state.transaction.transactions); // Get transactions from the state
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [errors, setErrors] = useState({}); // State to keep track of validation errors

  // useMemo to derive unique client names
  const clients = useMemo(() => {
    const names = invoices.map((invoice) => invoice.clientName);
    return Array.from(new Set(names));
  }, [invoices]);

  // Function to handle form field changes
  function handleChange(e) {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
    // If the user is typing in a field that had an error, clear that error
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  }

  // Function to validate form fields
  function validateForm() {
    let formIsValid = true;
    let errors = {};

    if (!newInvoice.clientName) {
      formIsValid = false;
      errors["clientName"] = "Client name is required";
    }

    if (newInvoice.amount <= 0) {
      formIsValid = false;
      errors["amount"] = "Amount should be greater than 0";
    }

    setErrors(errors);
    return formIsValid;
  }

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation Error");
      return; // Stop the form from submitting
    }
    try {
      // Dispatch an action to add the invoice
      dispatch(addInvoice(newInvoice, transactions));
      // Reset form fields and generate a new reference number for the next invoice
      setNewInvoice({
        clientName: "", // Reset client name to empty
        amount: 0,
        referenceNumber: `INV-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}`,
      });
      setErrors({}); // Clear any previous errors
    } catch (error) {
      console.error("Error submitting the invoice:", error);
      // Handle error
    }
  }

  // EXTRA FEATURES ----------
  // useMemo for sorting invoices
  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.creationDate) - new Date(a.creationDate); // newest first
      } else if (sortBy === "amount") {
        return b.amount - a.amount; // highest first
      }
      return 0;
    });
  }, [invoices, sortBy]);

  // Function to handle the filtering of invoices
  const filteredInvoices = useMemo(() => {
    return sortedInvoices.filter((invoice) => {
      return invoice.clientName.toLowerCase().includes(filter.toLowerCase());
    });
  }, [sortedInvoices, filter]);

  return (
    <div>
      <h1>Invoices</h1>
      <input
        type="text"
        placeholder="Filter by client name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>
      <div>
        <form onSubmit={handleSubmit}>
          <select
            name="clientName"
            value={newInvoice.clientName}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Please select a client
            </option>
            {clients.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.clientName && (
            <div style={{ color: "red" }}>{errors.clientName}</div>
          )}
          <input
            type="number"
            onChange={handleChange}
            name="amount"
            placeholder="Amount"
            required
          />
          {errors.amount && <div style={{ color: "red" }}>{errors.amount}</div>}
          <button type="submit">Add Invoice</button>
        </form>
      </div>
      <div>
        {
          filteredInvoices.map() // make this change
        }
      </div>
    </div>
  );
};

export default InvoicesPage;
