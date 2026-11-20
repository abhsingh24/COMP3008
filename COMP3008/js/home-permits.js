// Home page: lists the permits the user has paid for under "Active Permits".
$(function () {
  if (!sessionStorage.getItem("cuParking.started")) {
    Transaction.resetAll();
    sessionStorage.setItem("cuParking.started", "1");
  }

  const permits = Transaction.getPermits();
  if (permits.length === 0) {
    return; // keep the "You have no permits" message
  }

  const $list = $("#home-permits");
  permits.forEach(function (permit) {
    const $item = $("<li>").addClass("tx-permit-item");
    $("<strong>").text(permit.name).appendTo($item);
    $("<span>")
      .text(permit.term + " · " + permit.vehicle)
      .appendTo($item);
    $list.append($item);
  });

  $("#home-no-permits").prop("hidden", true);
  $list.prop("hidden", false);
});
