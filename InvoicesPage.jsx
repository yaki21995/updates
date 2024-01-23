import React, { useMemo, useState, useDispatch } from "react"; // Added import for useMemo, useDispatch
import { useSelector } from "react-redux";
import { addInvoice } from "../actions/invoiceActions"; // Import addInvoice action
import { addTransaction } from "../actions/transactionActions";

const InvoicesPage = () => {
  // ... existing state and function definitions
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    status: "PAID",
    creationDate: new Date(),
    referenceNumber: `INV-${new Date()} - ${Math.floor(Math.random() * 10000)}`,
  });
  const transactions = useSelector((state) => state.transaction.transactions); // Get transactions from the state
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
      // Check if the invoice is marked as PAID, then add a corresponding transaction
      if (newInvoice.status === "PAID") {
        // Create a corresponding transaction for the new invoice
        const newTransaction = {
          date: new Date(), // Use the current date for the transaction
          description: `Payment for Invoice ${newInvoice.referenceNumber}`,
          referenceNumber: newInvoice.referenceNumber,
          amount: newInvoice.amount,
        };

        // Dispatch an action to add the transaction
        dispatch(addTransaction(newTransaction));
      }

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

  return (
    <div>
      <h1>Invoices</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <select
            name="clientName"
            value={newInvoice.clientName}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>
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
