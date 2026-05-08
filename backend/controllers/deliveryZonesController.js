import db from "../models/db.js";

export const getDeliveryZones = (req, res) => {
  try {
    db.query("SELECT * FROM delivery_zones WHERE enabled = 1", (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch delivery zones" });
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDeliveryZoneById = (req, res) => {
  try {
    const { id } = req.params;
    db.query(
      "SELECT * FROM delivery_zones WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch delivery zone" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Delivery zone not found" });
        }
        res.json(results[0]);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createDeliveryZone = (req, res) => {
  try {
    const {
      name,
      pincodes,
      deliveryTime,
      charges,
      baseCharge,
      perKmCharge,
      handlingCharge,
      heavyItemCharge,
      codSurcharge,
      enabled
    } = req.body;

    if (!name || !pincodes || !deliveryTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
      "INSERT INTO delivery_zones (name, pincodes, delivery_time, charges, base_charge, per_km_charge, handling_charge, heavy_item_charge, cod_surcharge, enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [
        name,
        pincodes,
        deliveryTime,
        charges,
        baseCharge,
        perKmCharge,
        handlingCharge,
        heavyItemCharge,
        codSurcharge,
        enabled ? 1 : 0
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create delivery zone" });
        }
        res.status(201).json({
          message: "Delivery zone created successfully",
          id: result.insertId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDeliveryZone = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      pincodes,
      deliveryTime,
      charges,
      baseCharge,
      perKmCharge,
      handlingCharge,
      heavyItemCharge,
      codSurcharge,
      enabled
    } = req.body;

    if (!name || !pincodes || !deliveryTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
      "UPDATE delivery_zones SET name = ?, pincodes = ?, delivery_time = ?, charges = ?, base_charge = ?, per_km_charge = ?, handling_charge = ?, heavy_item_charge = ?, cod_surcharge = ?, enabled = ? WHERE id = ?",
      [
        name,
        pincodes,
        deliveryTime,
        charges,
        baseCharge,
        perKmCharge,
        handlingCharge,
        heavyItemCharge,
        codSurcharge,
        enabled ? 1 : 0,
        id
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update delivery zone" });
        }
        res.json({ message: "Delivery zone updated successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDeliveryZone = (req, res) => {
  try {
    const { id } = req.params;

    db.query("DELETE FROM delivery_zones WHERE id = ?", [id], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete delivery zone" });
      }
      res.json({ message: "Delivery zone deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkDeliveryAvailability = (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ error: "Invalid pincode" });
    }

    db.query(
      "SELECT * FROM delivery_zones WHERE enabled = 1 AND (pincodes LIKE ? OR pincodes LIKE ? OR pincodes LIKE ?)",
      [`${pincode}%`, `%,${pincode},%`, `%${pincode}`],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to check delivery availability" });
        }

        if (results.length === 0) {
          return res.json({ available: false, message: "Delivery not available at this pincode" });
        }

        const zone = results[0];
        res.json({
          available: true,
          zone: zone.name,
          deliveryTime: zone.delivery_time,
          charges: zone.charges,
          baseCharge: zone.base_charge,
          perKmCharge: zone.per_km_charge,
          message: `Delivery available in ${zone.name} - ${zone.delivery_time}`
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getZonesByCity = (req, res) => {
  try {
    const { city } = req.params;

    db.query(
      "SELECT * FROM delivery_zones WHERE enabled = 1 AND name LIKE ?",
      [`%${city}%`],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch delivery zones" });
        }
        res.json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const calculateDeliveryCharge = (req, res) => {
  try {
    const { zoneId, distance, itemCount, heavyItemCount, paymentMethod } = req.body;

    if (!zoneId) {
      return res.status(400).json({ error: "Zone ID is required" });
    }

    db.query(
      "SELECT * FROM delivery_zones WHERE id = ? AND enabled = 1",
      [zoneId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch zone data" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Zone not found" });
        }

        const zone = results[0];
        let charge = zone.base_charge;

        // Add distance charge
        if (distance) {
          charge += distance * zone.per_km_charge;
        }

        // Add item handling charge
        if (itemCount) {
          charge += itemCount * zone.handling_charge;
        }

        // Add heavy item charge
        if (heavyItemCount) {
          charge += heavyItemCount * zone.heavy_item_charge;
        }

        // Add COD surcharge if applicable
        if (paymentMethod === 'cod') {
          charge += zone.cod_surcharge;
        }

        res.json({
          baseCharge: zone.base_charge,
          distanceCharge: (distance || 0) * zone.per_km_charge,
          itemCharge: (itemCount || 0) * zone.handling_charge,
          heavyItemCharge: (heavyItemCount || 0) * zone.heavy_item_charge,
          codSurcharge: paymentMethod === 'cod' ? zone.cod_surcharge : 0,
          totalCharge: charge
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
