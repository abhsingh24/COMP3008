// Shared data for the transaction flow: permit details -> cart -> payment -> success.
const Transaction = (function () {
  const RESERVATION_KEY = "cuParking.reservation";  
  const VEHICLE_KEY = "cuParking.vehicle";
  const PERMITS_KEY = "cuParking.permits";
  const HST_RATE = 0.13; // Ontario HST

  const HOLD_MINUTES = 15;

  // localStorage only stores text, so we convert objects to and from JSON.
  function readJSON(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch (err) {
      localStorage.removeItem(key); // corrupted data: discard it
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Called when the user clicks "Reserve" on the Permit details screen.
  function saveReservation(permit) {
    const now = Date.now();
    const reservation = {
      lot: permit.lot,
      name: permit.name,
      term: permit.term,
      vehicle: permit.vehicle,
      price: permit.price,
      reservedAt: now,
      expiresAt: now + HOLD_MINUTES * 60 * 1000,
    };
    writeJSON(RESERVATION_KEY, reservation);
    return reservation;
  }

  function getReservation() {
    return readJSON(RESERVATION_KEY, null);
  }

  function clearReservation() {
    localStorage.removeItem(RESERVATION_KEY);
  }
  // The vehicle is saved by the Add vehicle form (a teammate's part).
  function getVehicle() {
    return readJSON(VEHICLE_KEY, null);
  }

  // Money is handled in cents (whole numbers) to avoid rounding errors.
  function getTotals(price) {
    const subtotal = Math.round(price * 100);
    const hst = Math.round(subtotal * HST_RATE);
    return { subtotal: subtotal, hst: hst, total: subtotal + hst };
  }

  function formatMoney(cents) {
    return "$" + (cents / 100).toFixed(2);
  }

    // Milliseconds left on the hold (never below 0).
  function timeLeft(reservation) {
    return Math.max(0, reservation.expiresAt - Date.now());
  }

  // Prototype test: ends the hold immediately.
  function endHoldNow() {
    const reservation = getReservation();
    if (reservation) {
      reservation.expiresAt = Date.now();
      writeJSON(RESERVATION_KEY, reservation);
    }
  }

  // Turns the paid reservation into an active permit and empties the cart.
  // Only the last 4 card digits are kept, never the full number or CVC.
  function completePayment(cardLast4) {
    const reservation = getReservation();
    if (!reservation) {
      return null;
    }
    const permit = {
      lot: reservation.lot,
      name: reservation.name,
      term: reservation.term,
      vehicle: reservation.vehicle,
      paid: getTotals(reservation.price).total,
      cardLast4: cardLast4,
      paidAt: Date.now(),
    };
    const permits = readJSON(PERMITS_KEY, []);
    permits.push(permit);
    writeJSON(PERMITS_KEY, permits);
    clearReservation();
    return permit;
  }

  // The public interface. Everything above it stays private.
  return {
    saveReservation: saveReservation,
    getReservation: getReservation,
    clearReservation: clearReservation,
    getVehicle: getVehicle,
    getTotals: getTotals,
    formatMoney: formatMoney,
    timeLeft: timeLeft,
    endHoldNow: endHoldNow,
    completePayment: completePayment,
  };
})();