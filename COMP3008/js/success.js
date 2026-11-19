// Success page: shows the permit that was just paid for.
$(function () {
  const permits = Transaction.getPermits();
  const permit = permits[permits.length - 1]; // the most recent one

  if (!permit) {
    $("#success-title").text("No recent payment");
    $("#success-none").prop("hidden", false);
    return;
  }

  $("#success-name").text(permit.name);
  $("#success-term").text(permit.term);
  $("#success-vehicle").text(permit.vehicle);
  $("#success-paid").text(Transaction.formatMoney(permit.paid) + " (incl. HST)");
  $("#success-last4").text("Ending in " + permit.cardLast4);
  $("#success-card").prop("hidden", false);
});