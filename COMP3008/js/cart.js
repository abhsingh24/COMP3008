// Cart page: shows the reserved permit (or an empty cart), the totals,
// and a countdown for the 15-minute hold.
$(function () {
  let timer = null;

  // 65000 ms -> "1:05"
  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + String(seconds).padStart(2, "0");
  }

  function showEmpty() {
    clearInterval(timer);
    $("#cart-filled").prop("hidden", true);
    $("#cart-empty").prop("hidden", false);
  }

  function showExpired() {
    clearInterval(timer);
    $("#cart-badge").text("Hold ended").addClass("tx-badge-ended");
    $("#cart-status").text("Hold ended, not paid");
    $("#cart-time").text("0:00");
    $("#cart-expired").prop("hidden", false);
    $("#cart-checkout").prop("disabled", true);
    $("#cart-cancel").text("Remove from cart");
  }

  // Runs every second: updates the countdown, or switches to "hold ended".
  function updateHold() {
    // With a vehicle already saved, skip the vehicle step and go straight to
    // the map (or back to the lot to reserve again).
    if (Transaction.getVehicle()) {
        $("#cart-browse").attr("href", "permits.html#permit-map");
        $("#cart-reserve-again").attr("href", "permits.html#lot-permits");
    }
    const reservation = Transaction.getReservation();
    if (!reservation) {
      showEmpty();
      return;
    }
    const left = Transaction.timeLeft(reservation);
    if (left > 0) {
      $("#cart-time").text(formatTime(left));
    } else {
      showExpired();
    }
  }

  function showReservation(reservation) {
    const totals = Transaction.getTotals(reservation.price);

    $("#cart-name").text(reservation.name);
    $("#cart-term").text(reservation.term);
    $("#cart-vehicle").text(reservation.vehicle);
    $("#cart-subtotal").text(Transaction.formatMoney(totals.subtotal));
    $("#cart-hst").text(Transaction.formatMoney(totals.hst));
    $("#cart-total").text(Transaction.formatMoney(totals.total));

    $("#cart-empty").prop("hidden", true);
    $("#cart-filled").prop("hidden", false);

    timer = setInterval(updateHold, 1000);
    updateHold();
  }

  const reservation = Transaction.getReservation();
  if (reservation) {
    showReservation(reservation);
  } else {
    showEmpty();
  }

  $("#cart-cancel").on("click", function () {
    Transaction.clearReservation();
    showEmpty();
  });

  $("#cart-checkout").on("click", function () {
    window.location.href = "payment.html";
  });

  $("#cart-test-expire").on("click", function () {
    Transaction.endHoldNow();
    updateHold();
  });
});