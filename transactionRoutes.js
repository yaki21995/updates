// add a transaction
router.post("/", async (req, res) => {
  const tran = new Transaction(req.body);
  try {
    const transaction = await tran.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
