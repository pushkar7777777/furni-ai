import React, { useState } from 'react';
import { QrCode, Smartphone, CreditCard, Wallet, Building2, TrendingDown } from 'lucide-react';
import './PaymentMethods.css';

const PaymentMethods = ({ selectedMethod, onMethodChange, orderTotal }) => {
  const [showQR, setShowQR] = useState(false);
  const [upiNumber, setUpiNumber] = useState('');
  const [savedCards, setSavedCards] = useState([
    { id: 1, last4: '4242', bank: 'HDFC Bank', isDefault: true },
    { id: 2, last4: '5555', bank: 'ICICI Bank', isDefault: false }
  ]);
  const [selectedCard, setSelectedCard] = useState(1);
  const [savedUPI, setSavedUPI] = useState([
    { id: 1, number: 'pushkar.pandey@upi', bank: 'Google Pay', isDefault: true },
    { id: 2, number: 'pushkar@okhdfcbank', bank: 'HDFC Bank' }
  ]);
  const [selectedUPI, setSelectedUPI] = useState(1);
  const paymentOptions = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Quick & Easy',
      badge: 'FASTEST',
      color: '#FFDAB9'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCode,
      description: 'Scan & Pay',
      badge: 'SECURE',
      color: '#A67B5B'
    },
    {
      id: 'card',
      name: 'Card',
      icon: CreditCard,
      description: 'Credit/Debit',
      badge: 'TRUSTED',
      color: '#A67B5B'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'Direct Bank Transfer',
      badge: null,
      color: '#FFDAB9'
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: Wallet,
      description: 'Saved Balance',
      badge: 'QUICK',
      color: '#A67B5B'
    },
    {
      id: 'emi',
      name: 'EMI',
      icon: TrendingDown,
      description: 'No-Cost EMI',
      badge: '0% APR',
      color: '#FFDAB9'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: null,
      description: 'Pay at Doorstep',
      badge: null,
      color: '#A67B5B'
    }
  ];

  const banks = [
    'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI', 'Kotak Mahindra',
    'YES Bank', 'IndusInd Bank', 'Canara Bank', 'Federal Bank'
  ];

  const upiApps = ['Google Pay', 'PhonePe', 'Paytm', 'WhatsApp Pay', 'BHIM'];

  const renderUPISection = () => (
    <div className="payment-details-card">
      <h3 className="payment-detail-title">UPI Payment</h3>
      
      <div className="upi-input-group">
        <label>Enter UPI ID</label>
        <input
          type="text"
          placeholder="yourname@upi or yourname@bankname"
          value={upiNumber}
          onChange={(e) => setUpiNumber(e.target.value)}
          className="upi-input"
        />
        <p className="input-hint">Example: pushkar@googlepay or pushkar@okhdfcbank</p>
      </div>

      <div className="saved-upi-section">
        <h4>Your UPI IDs</h4>
        <div className="saved-upi-list">
          {savedUPI.map(upi => (
            <label key={upi.id} className="upi-option">
              <input
                type="radio"
                name="upi-saved"
                checked={selectedUPI === upi.id}
                onChange={() => setSelectedUPI(upi.id)}
              />
              <div className="upi-info">
                <span className="upi-number">{upi.number}</span>
                <span className="upi-bank">{upi.bank}</span>
              </div>
              {upi.isDefault && <span className="default-badge">Default</span>}
            </label>
          ))}
        </div>
      </div>

      <button className="qr-toggle-btn" onClick={() => setShowQR(!showQR)}>
        <QrCode size={20} />
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </button>

      {showQR && (
        <div className="qr-section">
          <div className="qr-placeholder">
            <div className="qr-mock">
              <div className="qr-pattern"></div>
              <p className="qr-amount">₹{orderTotal}</p>
            </div>
          </div>
          <p className="qr-instruction">
            Scan this QR code with any UPI app to instantly pay
          </p>
        </div>
      )}
    </div>
  );

  const renderCardSection = () => (
    <div className="payment-details-card">
      <h3 className="payment-detail-title">Card Details</h3>
      
      <div className="saved-cards-section">
        <h4>Your Saved Cards</h4>
        <div className="cards-list">
          {savedCards.map(card => (
            <label key={card.id} className="card-option">
              <input
                type="radio"
                name="saved-cards"
                checked={selectedCard === card.id}
                onChange={() => setSelectedCard(card.id)}
              />
              <div className="card-display">
                <div className="card-placeholder" style={{background: `linear-gradient(135deg, #A67B5B 0%, #2E1F13 100%)`}}>
                  <span className="card-chip">💳</span>
                  <span className="card-last4">•••• {card.last4}</span>
                </div>
                <div className="card-details">
                  <span className="card-bank text-[#FFF8F0] font-bold">{card.bank}</span>
                  {card.isDefault && <span className="default-badge ml-2">Default</span>}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="add-new-card">
        <label>Add New Card</label>
        <input type="text" placeholder="Card Number (16 digits)" maxLength="16" className="card-input" />
        <div className="card-row">
          <input type="text" placeholder="MM/YY" maxLength="5" className="card-input expiry" />
          <input type="text" placeholder="CVV" maxLength="3" className="card-input cvv" />
        </div>
        <input type="text" placeholder="Name on Card" className="card-input" />
      </div>
    </div>
  );

  const renderNetBankingSection = () => (
    <div className="payment-details-card">
      <h3 className="payment-detail-title">Select Your Bank</h3>
      <div className="banks-grid">
        {banks.map(bank => (
          <button key={bank} className="bank-option">
            {bank}
          </button>
        ))}
      </div>
    </div>
  );

  const renderWalletSection = () => (
    <div className="payment-details-card">
      <h3 className="payment-detail-title">Digital Wallets</h3>
      <div className="wallets-grid">
        {['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay', 'WhatsApp Pay'].map(wallet => (
          <button key={wallet} className="wallet-option">
            <Wallet size={24} />
            {wallet}
          </button>
        ))}
      </div>
      <div className="wallet-benefits">
        <p>💰 Extra 5% cashback on all wallets</p>
        <p>✓ Instant confirmation</p>
      </div>
    </div>
  );

  const renderEMISection = () => (
    <div className="payment-details-card">
      <h3 className="payment-detail-title">EMI Options</h3>
      <div className="emi-options">
        {[
          { months: 3, charge: 0, monthly: (orderTotal / 3).toFixed(2) },
          { months: 6, charge: 0, monthly: (orderTotal / 6).toFixed(2) },
          { months: 12, charge: 999, monthly: ((orderTotal + 999) / 12).toFixed(2) }
        ].map(option => (
          <div key={option.months} className="emi-option">
            <label>
              <input type="radio" name="emi-option" />
              <span className="emi-info">
                <strong>{option.months} Months</strong>
                <span className="emi-monthly">₹{option.monthly}/month</span>
                {option.charge > 0 && <span className="emi-charge">+ ₹{option.charge} processing fee</span>}
              </span>
            </label>
          </div>
        ))}
      </div>
      <p className="emi-note">Applicable on orders above ₹5,000</p>
    </div>
  );

  return (
    <div className="payment-methods-container">
      <h2 className="section-title">Select Payment Method</h2>
      
      <div className="payment-grid">
        {paymentOptions.map(option => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              className={`payment-method-btn ${selectedMethod === option.id ? 'active' : ''}`}
              onClick={() => onMethodChange(option.id)}
            >
              {option.badge && <span className="method-badge">{option.badge}</span>}
              {IconComponent && <IconComponent size={28} color={option.color} />}
              <span className="method-name">{option.name}</span>
              <span className="method-desc">{option.description}</span>
            </button>
          );
        })}
      </div>

      <div className="payment-details-section">
        {selectedMethod === 'upi' && renderUPISection()}
        {selectedMethod === 'qr' && renderUPISection()}
        {selectedMethod === 'card' && renderCardSection()}
        {selectedMethod === 'netbanking' && renderNetBankingSection()}
        {selectedMethod === 'wallet' && renderWalletSection()}
        {selectedMethod === 'emi' && renderEMISection()}
      </div>

      <div className="payment-security">
        <div className="security-item">
          <span>🔒</span>
          <span>256-bit SSL Encryption</span>
        </div>
        <div className="security-item">
          <span>✓</span>
          <span>100% Secure & Safe</span>
        </div>
        <div className="security-item">
          <span>💳</span>
          <span>PCI DSS Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
