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
