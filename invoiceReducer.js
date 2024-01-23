const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    // ---- new code added here to connect invoices and transactions ----

    case "FETCH_INVOICES_SUCCESS":
      const updatedInvoices = action.payload.map((invoice) => {
        if (state.transactions && Array.isArray(state.transactions)) {
          // Ensure transactions exist and is an array
          const matchingTransaction = state.transactions.find(
            (transaction) =>
              transaction.referenceNumber === invoice.referenceNumber &&
              transaction.amount === invoice.amount &&
              new Date(transaction.date) > new Date(invoice.creationDate)
          );

          if (matchingTransaction) {
            return { ...invoice, status: "PAID" };
          }
        }
        return invoice; // Return the invoice as is if no matching transaction is found
      });

      return {
        ...state,
        // ----- update here -----
        invoices: updatedInvoices,
      };
    case "FETCH_INVOICES_ERROR":
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
        error: action.payload,
      };
    // ---- form completion code added here! ----
    case "ADD_INVOICE_SUCCESS":
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
        error: action.payload,
      };
    case "ADD_INVOICE_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    // ---- end of form completion code added here! ----
    default:
      return state;
  }
};

export default invoiceReducer;
