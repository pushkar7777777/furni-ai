import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, AlertCircle, Truck, Clock } from 'lucide-react';
import './DeliveryValidator.css';

const DeliveryValidator = ({ address, onAddressChange, onValidationChange }) => {
  const [validationStatus, setValidationStatus] = useState(null); // 'loading', 'available', 'unavailable', null
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [showAlternate, setShowAlternate] = useState(false);
  const [pinnedZones] = useState([
    {
      id: 1,
      name: 'Delhi NCR',
      pincodes: ['110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008', '110009', '110010'],
      deliveryTime: '2-3 days',
      charges: 149,
      serviceability: true
    },
    {
      id: 2,
      name: 'Mumbai Metropolitan',
      pincodes: ['400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008', '400009', '400010'],
      deliveryTime: '2-4 days',
      charges: 199,
      serviceability: true
    },
    {
      id: 3,
      name: 'Bangalore',
      pincodes: ['560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009', '560010'],
      deliveryTime: '3-4 days',
      charges: 149,
      serviceability: true
    },
    {
      id: 4,
      name: 'Hyderabad',
      pincodes: ['500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010'],
      deliveryTime: '3-5 days',
      charges: 199,
      serviceability: true
    },
    {
      id: 5,
      name: 'Pune',
      pincodes: ['411001', '411002', '411003', '411004', '411005', '411006', '411007', '411008', '411009', '411010'],
      deliveryTime: '1-2 days',
      charges: 99,
      serviceability: true
    },
    {
      id: 6,
      name: 'Chennai',
      pincodes: ['600001', '600002', '600003', '600004', '600005', '600006', '600007', '600008', '600009', '600010'],
      deliveryTime: '4-5 days',
      charges: 249,
      serviceability: true
    },
    {
      id: 7,
      name: 'Kolkata',
      pincodes: ['700001', '700002', '700003', '700004', '700005', '700006', '700007', '700008', '700009', '700010'],
      deliveryTime: '4-6 days',
      charges: 249,
      serviceability: true
    },
    {
      id: 8,
      name: 'Jaipur',
      pincodes: ['302001', '302002', '302003', '302004', '302005'],
      deliveryTime: '4-5 days',
      charges: 199,
      serviceability: true
    },
    {
      id: 9,
      name: 'Remote Areas',
      pincodes: [],
      deliveryTime: '7-10 days',
      charges: 399,
      serviceability: false
    }
  ]);

  const validateAddress = (pincode) => {
    setValidationStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      const zone = pinnedZones.find(z => z.pincodes.includes(pincode));
      
      if (zone) {
        setDeliveryInfo({
          available: true,
          zone: zone.name,
          deliveryTime: zone.deliveryTime,
          charges: zone.charges,
          message: `Delivery available in ${zone.name} - ${zone.deliveryTime}`
        });
        setValidationStatus('available');
        onValidationChange({ available: true, ...zone });
      } else {
        setDeliveryInfo({
          available: false,
          message: 'Delivery not available at this pincode. Check nearby pincodes or contact support.',
          alternateZones: pinnedZones.filter(z => z.serviceability).slice(0, 3)
        });
        setValidationStatus('unavailable');
        onValidationChange({ available: false });
      }
    }, 800);
  };

  useEffect(() => {
    if (address?.postalCode?.length === 6) {
      validateAddress(address.postalCode);
    } else if (validationStatus !== null) {
      setValidationStatus(null);
      setDeliveryInfo(null);
      onValidationChange({ available: false });
    }
  }, [address?.postalCode]);

  return (
    <div className="delivery-validator-container">
      <h2 className="validator-title">
        <MapPin size={28} />
        Verify Delivery Address
      </h2>

      {/* Validation Status */}
      {validationStatus && (
        <div className={`validation-status ${validationStatus}`}>
          {validationStatus === 'loading' && (
            <div className="status-content loading">
              <div className="spinner"></div>
              <p>Checking delivery availability...</p>
            </div>
          )}

          {validationStatus === 'available' && deliveryInfo && (
            <div className="status-content available">
              <div className="status-header">
                <CheckCircle size={24} color="#4CAF50" />
                <span className="status-text">Delivery Available!</span>
              </div>
              <div className="delivery-details">
                <div className="detail-item">
                  <Truck size={18} />
                  <div>
                    <p className="detail-label">Zone</p>
                    <p className="detail-value">{deliveryInfo.zone}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={18} />
                  <div>
                    <p className="detail-label">Estimated Delivery</p>
                    <p className="detail-value">{deliveryInfo.deliveryTime}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="currency">₹</span>
                  <div>
                    <p className="detail-label">Delivery Charge</p>
                    <p className="detail-value">{deliveryInfo.charges}</p>
                  </div>
                </div>
              </div>
              <p className="status-message success">{deliveryInfo.message}</p>
            </div>
          )}

          {validationStatus === 'unavailable' && deliveryInfo && (
            <div className="status-content unavailable">
              <div className="status-header">
                <AlertCircle size={24} color="#F44336" />
                <span className="status-text">Not Delivered to This Area</span>
              </div>
              <p className="status-message error">{deliveryInfo.message}</p>

              <div className="alternate-section">
                <button
                  type="button"
                  className="alternate-toggle"
                  onClick={() => setShowAlternate(!showAlternate)}
                >
                  {showAlternate ? '▼' : '▶'} Check Nearby Serviceable Areas
                </button>

                {showAlternate && (
                  <div className="alternate-zones">
                    {deliveryInfo.alternateZones?.map(zone => (
                      <div key={zone.id} className="alternate-zone-card">
                        <div className="zone-name">{zone.name}</div>
                        <div className="zone-info">
                          <span>⏱️ {zone.deliveryTime}</span>
                          <span>₹{zone.charges}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" className="contact-support-btn">
                💬 Contact Support
              </button>
            </div>
          )}
        </div>
      )}

      {/* Serviceable Areas Grid */}
      <div className="serviceable-areas-section">
        <h3>Serviceable Areas</h3>
        <div className="zones-grid">
          {pinnedZones.map(zone => (
            <div key={zone.id} className="zone-card">
              <div className="zone-header">
                <h4>{zone.name}</h4>
                {zone.serviceability && <span className="service-badge">✓ Available</span>}
              </div>
              <div className="zone-details">
                <p><strong>Delivery Time:</strong> {zone.deliveryTime}</p>
                <p><strong>Base Charge:</strong> ₹{zone.charges}</p>
                <p><strong>Pincodes:</strong> {zone.pincodes.length > 0 ? `${zone.pincodes.length}+ pincodes` : 'Remote area'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free Delivery Info */}
      <div className="free-delivery-banner">
        <div className="banner-content">
          <span className="banner-icon">🎉</span>
          <div>
            <p className="banner-title">Free Delivery Available</p>
            <p className="banner-text">Get FREE delivery on orders above ₹75,000 in all metros!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryValidator;
