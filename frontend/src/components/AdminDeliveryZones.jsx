import React, { useState } from 'react';
import { Trash2, Edit2, Plus, Save, X, MapPin } from 'lucide-react';
import './AdminDeliveryZones.css';

const AdminDeliveryZones = () => {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: 'Delhi NCR',
      pincodes: '110001-110100',
      deliveryTime: '2-3 days',
      charges: 149,
      baseCharge: 100,
      perKmCharge: 0.5,
      handlingCharge: 35,
      heavyItemCharge: 220,
      codSurcharge: 49,
      enabled: true
    },
    {
      id: 2,
      name: 'Mumbai Metropolitan',
      pincodes: '400001-400700',
      deliveryTime: '2-4 days',
      charges: 199,
      baseCharge: 120,
      perKmCharge: 0.75,
      handlingCharge: 35,
      heavyItemCharge: 220,
      codSurcharge: 49,
      enabled: true
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pincodes: '',
    deliveryTime: '',
    charges: 0,
    baseCharge: 0,
    perKmCharge: 0,
    handlingCharge: 35,
    heavyItemCharge: 220,
    codSurcharge: 49,
    enabled: true
  });

  const handleAddNew = () => {
    setFormData({
      name: '',
      pincodes: '',
      deliveryTime: '',
      charges: 0,
      baseCharge: 0,
      perKmCharge: 0,
      handlingCharge: 35,
      heavyItemCharge: 220,
      codSurcharge: 49,
      enabled: true
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (zone) => {
    setFormData(zone);
    setEditingId(zone.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.pincodes || !formData.deliveryTime) {
      alert('Please fill all required fields');
      return;
    }

    if (editingId) {
      setZones(zones.map(z => z.id === editingId ? { ...formData, id: editingId } : z));
    } else {
      setZones([...zones, { ...formData, id: Date.now() }]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      setZones(zones.filter(z => z.id !== id));
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return formData.baseCharge + formData.perKmCharge * 100 + formData.handlingCharge;
  };

  return (
    <div className="admin-delivery-zones-container">
      <div className="admin-header">
        <div className="header-title">
          <MapPin size={32} />
          <h1>Delivery Zones Management</h1>
        </div>
        <button className="btn-add-zone" onClick={handleAddNew}>
          <Plus size={20} />
          Add New Zone
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="zone-form-container">
          <div className="form-header">
            <h2>{editingId ? 'Edit Delivery Zone' : 'Create New Delivery Zone'}</h2>
            <button className="btn-close" onClick={() => setShowForm(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>Zone Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="e.g., Delhi NCR"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Pincode Range *</label>
                <input
                  type="text"
                  value={formData.pincodes}
                  onChange={(e) => handleFormChange('pincodes', e.target.value)}
                  placeholder="e.g., 110001-110100 or 400001,400002,400003"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Delivery Time *</label>
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => handleFormChange('deliveryTime', e.target.value)}
                  placeholder="e.g., 2-3 days"
                  className="form-input"
                />
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="zone-enabled"
                  checked={formData.enabled}
                  onChange={(e) => handleFormChange('enabled', e.target.checked)}
                />
                <label htmlFor="zone-enabled">Zone Enabled</label>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h3>Pricing Configuration</h3>
              
              <div className="form-group">
                <label>Base Charge (₹)</label>
                <input
                  type="number"
                  value={formData.baseCharge}
                  onChange={(e) => handleFormChange('baseCharge', parseFloat(e.target.value))}
                  placeholder="Base delivery charge"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Per KM Charge (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.perKmCharge}
                  onChange={(e) => handleFormChange('perKmCharge', parseFloat(e.target.value))}
                  placeholder="Charge per kilometer"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Handling Charge per Item (₹)</label>
                <input
                  type="number"
                  value={formData.handlingCharge}
                  onChange={(e) => handleFormChange('handlingCharge', parseFloat(e.target.value))}
                  placeholder="Per item handling"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Heavy Item Charge (₹)</label>
                <input
                  type="number"
                  value={formData.heavyItemCharge}
                  onChange={(e) => handleFormChange('heavyItemCharge', parseFloat(e.target.value))}
                  placeholder="For sofas, beds, wardrobes"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>COD Surcharge (₹)</label>
                <input
                  type="number"
                  value={formData.codSurcharge}
                  onChange={(e) => handleFormChange('codSurcharge', parseFloat(e.target.value))}
                  placeholder="Cash on Delivery surcharge"
                  className="form-input"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="form-section pricing-summary">
              <h3>Estimated Charges</h3>
              <div className="summary-item">
                <span>Base Charge:</span>
                <span>₹{formData.baseCharge}</span>
              </div>
              <div className="summary-item">
                <span>Per KM (100km avg):</span>
                <span>₹{(formData.perKmCharge * 100).toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Handling Charge:</span>
                <span>₹{formData.handlingCharge}</span>
              </div>
              <div className="summary-item total">
                <span>Total Estimate:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <p className="summary-note">*Note: This is an estimate. Actual charge varies based on distance & items.</p>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-save" onClick={handleSave}>
              <Save size={18} />
              Save Zone
            </button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Zones Table */}
      <div className="zones-table-container">
        <table className="zones-table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Pincode Range</th>
              <th>Delivery Time</th>
              <th>Base Charge</th>
              <th>Per KM Charge</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(zone => (
              <tr key={zone.id} className={!zone.enabled ? 'disabled' : ''}>
                <td className="zone-name">{zone.name}</td>
                <td>{zone.pincodes}</td>
                <td>{zone.deliveryTime}</td>
                <td>₹{zone.baseCharge}</td>
                <td>₹{zone.perKmCharge}/km</td>
                <td>
                  <span className={`status-badge ${zone.enabled ? 'active' : 'inactive'}`}>
                    {zone.enabled ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn-action edit"
                    onClick={() => handleEdit(zone)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => handleDelete(zone.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statistics */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{zones.filter(z => z.enabled).length}</div>
          <div className="stat-label">Active Zones</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{zones.length}</div>
          <div className="stat-label">Total Zones</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{Math.min(...zones.map(z => z.baseCharge))}</div>
          <div className="stat-label">Lowest Charge</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{Math.max(...zones.map(z => z.baseCharge))}</div>
          <div className="stat-label">Highest Charge</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="quick-action-btn">
            📊 Export Zones (CSV)
          </button>
          <button className="quick-action-btn">
            📥 Import Zones (CSV)
          </button>
          <button className="quick-action-btn">
            🔄 Sync with Shipping Partner
          </button>
          <button className="quick-action-btn">
            📋 View Delivery Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeliveryZones;
