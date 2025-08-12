import express from "express";
import Timer from "../models/Timer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { shop } = req.query;
  if (!shop) return res.status(400).json({ error: "Missing shop" });
  const timers = await Timer.find({ shop }).sort({ createdAt: -1 });
  res.json(timers);
});

router.post("/", async (req, res) => {
  try {
    const timer = await Timer.create(req.body);
    res.status(201).json(timer);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/public", async (req, res) => {
  try {
    const { shop } = req.query;
    if (!shop) {
      return res.status(400).json({ error: "Missing shop parameter" });
    }

    const timers = await Timer.find({ shop }).sort({ createdAt: -1 });

    res.json({
      success: true,
      timers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const timer = await Timer.findById(req.params.id);
  if (!timer) return res.status(404).json({});
  res.json(timer);
});

router.put("/:id", async (req, res) => {
  const timer = await Timer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(timer);
});

router.delete("/:id", async (req, res) => {
  await Timer.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// router.get("/public/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { shop } = req.query;

//     if (!shop) {
//       return res.status(400).json({ error: "Missing shop" });
//     }

//     // Example: Find latest active timer for this shop/product
//     const timer = await Timer.findOne({ shop, productId }).sort({
//       createdAt: -1,
//     });

//     if (!timer) {
//       return res.status(404).json({ error: "No timer found" });
//     }

//     res.json({
//       endDate: timer.endDate,
//       position: timer.position || "top",
//     });
//   } catch (err) {
//     console.error("Error fetching public timer:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

export default router;
