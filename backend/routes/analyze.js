import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { analyzeSkinWithAI } from '../services/visionAiService.js';
import ScanRecord from '../models/ScanRecord.js';
import { getMemoryStore } from '../config/db.js';

const router = express.Router();

// Memory storage for multer so we can stream buffer directly to AI vision core
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (JPG, PNG, WEBP) are supported.'), false);
    }
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image uploaded. Please upload a clear photo of the skin lesion or area.'
      });
    }

    // Parse additional patient context sent via FormData
    let symptoms = [];
    if (req.body.symptoms) {
      try {
        symptoms = typeof req.body.symptoms === 'string' ? JSON.parse(req.body.symptoms) : req.body.symptoms;
      } catch (e) {
        symptoms = req.body.symptoms.split(',').map(s => s.trim());
      }
    }

    const patientContext = {
      symptoms,
      bodyLocation: req.body.bodyLocation || 'Not specified',
      durationDays: req.body.durationDays || 'Not specified',
      ageGroup: req.body.ageGroup || 'Adult'
    };

    const customApiKey = req.headers['x-api-key'] || req.headers['x-gemini-key'] || req.body.customApiKey || null;

    // Call Vision AI Service
    const aiResult = await analyzeSkinWithAI(
      req.file.buffer,
      req.file.mimetype,
      patientContext,
      customApiKey
    );

    // Create thumbnail base64 data url for storage and quick display
    const thumbnailDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const recordData = {
      imageThumbnail: thumbnailDataUrl,
      imageName: req.file.originalname || `skin-scan-${Date.now()}.jpg`,
      mimeType: req.file.mimetype,
      fileSizeKB: Math.round(req.file.size / 1024),
      symptoms: patientContext.symptoms,
      bodyLocation: patientContext.bodyLocation,
      durationDays: patientContext.durationDays,
      possibleConditions: aiResult.possible_conditions || [],
      visibleFeatures: aiResult.visible_features || [],
      causesAndTriggers: aiResult.causes_and_triggers || [],
      preventionTips: aiResult.prevention_tips || [],
      homeCareAdvice: aiResult.home_care_advice || [],
      seeDoctorUrgency: aiResult.see_doctor_urgency || 'low',
      clinicalSummary: aiResult.clinical_summary || '',
      immediateCareSigns: aiResult.immediate_care_signs || [],
      disclaimer: aiResult.disclaimer,
      aiModelUsed: aiResult.aiModelUsed || 'Clinical Deep Vision AI',
      createdAt: new Date()
    };

    let savedRecordId = 'temp-' + Date.now();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const savedDoc = await ScanRecord.create(recordData);
      savedRecordId = savedDoc._id;
    } else {
      // In-memory storage fallback
      const inMemoryItem = { _id: savedRecordId, ...recordData };
      const memoryStore = getMemoryStore();
      memoryStore.unshift(inMemoryItem);
      if (memoryStore.length > 50) memoryStore.pop(); // keep latest 50
    }

    return res.status(200).json({
      success: true,
      scanId: savedRecordId,
      result: aiResult,
      storedIn: mongoose.connection.readyState === 1 ? 'MongoDB' : 'Memory Store'
    });

  } catch (error) {
    console.error('[Analyze Route Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error while processing skin image analysis.'
    });
  }
});

export default router;
