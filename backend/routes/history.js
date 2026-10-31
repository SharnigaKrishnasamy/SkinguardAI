import express from 'express';
import mongoose from 'mongoose';
import ScanRecord from '../models/ScanRecord.js';
import { getMemoryStore } from '../config/db.js';

const router = express.Router();

// GET /api/history - Retrieve all recent scans
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await ScanRecord.find()
        .sort({ createdAt: -1 })
        .limit(40)
        .lean();
      return res.json({ success: true, count: records.length, data: records });
    } else {
      const memoryStore = getMemoryStore();
      return res.json({ success: true, count: memoryStore.length, data: memoryStore });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/history/:id - Retrieve specific scan details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const record = await ScanRecord.findById(id);
      if (record) return res.json({ success: true, data: record });
    }
    
    // Check memory store
    const memoryStore = getMemoryStore();
    const record = memoryStore.find(item => String(item._id) === String(id));
    if (!record) return res.status(404).json({ success: false, error: 'Scan record not found' });
    return res.json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/history/:id - Delete a specific scan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deletedFromDb = false;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await ScanRecord.findByIdAndDelete(id);
      deletedFromDb = true;
    }

    // Also clean from memory store
    const memoryStore = getMemoryStore();
    const idx = memoryStore.findIndex(item => String(item._id) === String(id));
    if (idx !== -1) {
      memoryStore.splice(idx, 1);
    }

    return res.json({ 
      success: true, 
      message: 'Scan deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('[Delete Scan Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/history - Clear all scans
router.delete('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await ScanRecord.deleteMany({});
    }
    const memoryStore = getMemoryStore();
    memoryStore.length = 0;

    return res.json({ success: true, message: 'All scan records cleared successfully' });
  } catch (error) {
    console.error('[Clear All Scans Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
