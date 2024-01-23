const [filter, setFilter] = useState("");
const [sortBy, setSortBy] = useState("date");

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
 