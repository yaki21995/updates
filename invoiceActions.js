/*
Automatic Status Update: When invoices are fetched, their payment status is automatically 
determined based on existing transactions. This aligns with the requirement that the system 
should give insights into the financial status without manual intervention.

Adding Invoices: When a new invoice is added, the system intelligently checks if the invoice 
should be marked as "PAID" based on existing transactions. This ensures that the invoice list 
is always up-to-date and reflects the actual financial situation.

Data Consistency: By centralizing the logic of matching transactions and invoices in the 
reducer and the action creator, the system maintains consistency. It ensures that the same 
rules are applied whenever the invoice status is determined or updated.
*/

export const addInvoice = (invoiceData, transactions) => async (dispatch) => {
  try {
    // Determine if there's a matching transaction for the new invoice
    const matchingTransaction = transactions.find(
      (transaction) =>
        transaction.referenceNumber === invoiceData.referenceNumber &&
        transaction.amount === invoiceData.amount &&
        new Date(transaction.date) > new Date(invoiceData.creationDate)
    );

    // If a matching transaction is found, set the invoice status to 'PAID'
    const newInvoice = matchingTransaction
      ? { ...invoiceData, status: "PAID" }
      : invoiceData;

    const response = await fetch("http://localhost:3000/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvoice),
    });
    const data = await response.json();

    dispatch({
      type: "ADD_INVOICE_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ADD_INVOICE_ERROR",
      payload: error,
    });
  }
};
