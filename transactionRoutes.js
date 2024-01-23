// routes/transactionRoutes.js
router.post("/", async (req, res) => {
  try {
    const transaction = await Transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
