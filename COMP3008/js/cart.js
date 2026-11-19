// Cart page: shows the reserved permit (or an empty cart) and the totals.
$(function () {
  function showEmpty() {
    $("#cart-filled").prop("hidden", true);
    $("#cart-empty").prop("hidden", false);
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
});