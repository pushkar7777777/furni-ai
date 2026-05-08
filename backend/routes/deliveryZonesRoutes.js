import express from 'express';
import {
  getDeliveryZones,
  getDeliveryZoneById,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  checkDeliveryAvailability,
  getZonesByCity,
  calculateDeliveryCharge
} from '../controllers/deliveryZonesController.js';

const router = express.Router();

// Get all delivery zones
router.get('/zones', getDeliveryZones);

// Get delivery zone by ID
router.get('/zones/:id', getDeliveryZoneById);

// Create new delivery zone
router.post('/zones', createDeliveryZone);

// Update delivery zone
router.put('/zones/:id', updateDeliveryZone);

// Delete delivery zone
router.delete('/zones/:id', deleteDeliveryZone);

// Check delivery availability for a pincode
router.post('/check-availability', checkDeliveryAvailability);

// Get zones by city
router.get('/zones/city/:city', getZonesByCity);

// Calculate delivery charge
router.post('/calculate-charge', calculateDeliveryCharge);

export default router;
