const cityProfiles = {
  pune: { zone: "Local", distanceKm: 18, eta: "1-2 days", multiplier: 1 },
  mumbai: { zone: "Metro", distanceKm: 150, eta: "2-3 days", multiplier: 1.15 },
  delhi: { zone: "Metro", distanceKm: 1420, eta: "4-6 days", multiplier: 1.35 },
  bengaluru: { zone: "Metro", distanceKm: 840, eta: "3-5 days", multiplier: 1.25 },
  bangalore: { zone: "Metro", distanceKm: 840, eta: "3-5 days", multiplier: 1.25 },
  hyderabad: { zone: "Metro", distanceKm: 560, eta: "3-4 days", multiplier: 1.2 },
  chennai: { zone: "Metro", distanceKm: 1180, eta: "4-6 days", multiplier: 1.3 },
  kolkata: { zone: "Metro", distanceKm: 1820, eta: "5-7 days", multiplier: 1.45 },
  ahmedabad: { zone: "Tier 1", distanceKm: 660, eta: "3-5 days", multiplier: 1.22 },
  jaipur: { zone: "Tier 1", distanceKm: 1160, eta: "4-6 days", multiplier: 1.32 },
  nagpur: { zone: "Tier 1", distanceKm: 720, eta: "3-5 days", multiplier: 1.22 },
  nashik: { zone: "Regional", distanceKm: 215, eta: "2-4 days", multiplier: 1.1 }
};

const getDistanceFromPostalCode = (postalCode = "") => {
  const digits = String(postalCode).replace(/\D/g, "");
  if (!digits) return null;
  const prefix = Number(digits.slice(0, 2));
  if (prefix >= 40 && prefix <= 41) return 90;
  if (prefix >= 42 && prefix <= 44) return 380;
  if (prefix >= 11 && prefix <= 19) return 1420;
  if (prefix >= 50 && prefix <= 53) return 700;
  if (prefix >= 56 && prefix <= 59) return 840;
  if (prefix >= 60 && prefix <= 64) return 1180;
  if (prefix >= 70 && prefix <= 74) return 1820;
  return null;
};

const estimateDelivery = ({ cartItems = [], subtotal = 0, city = "", state = "", postalCode = "", paymentMethod = "upi" }) => {
  const cityKey = String(city).trim().toLowerCase();
  const profile = cityProfiles[cityKey];
  const distanceKm = profile?.distanceKm || getDistanceFromPostalCode(postalCode) || 950;
  const zone = profile?.zone || (distanceKm <= 250 ? "Regional" : distanceKm <= 900 ? "Interstate" : "National");
  const eta = profile?.eta || (distanceKm <= 250 ? "2-4 days" : distanceKm <= 900 ? "3-5 days" : "5-8 days");
  const quantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const heavyItemCount = cartItems.filter((item) => {
    const name = String(item.name || "").toLowerCase();
    return ["sofa", "bed", "wardrobe", "dining", "table", "tv stand", "cabinet"].some((keyword) => name.includes(keyword));
  }).length;
  const base = subtotal >= 50000 ? 0 : 149;
  const distanceCharge = Math.ceil(distanceKm * 0.85 * (profile?.multiplier || 1));
  const handlingCharge = quantity * 35 + heavyItemCount * 220;
  const remoteCharge = String(state).trim() && !profile && distanceKm > 900 ? 300 : 0;
  const codCharge = paymentMethod === "cod" ? 49 : 0;
  const shippingCharge = subtotal >= 75000 ? 0 : Math.max(0, base + distanceCharge + handlingCharge + remoteCharge + codCharge);

  return { shippingCharge, distanceKm, zone, eta, handlingCharge, codCharge };
};

module.exports = { estimateDelivery };
