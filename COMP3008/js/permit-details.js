// Lot P7 + Permit details screens: term dropdown, permit card and "Reserve".
$(function () {
  // Only Lot P7 is clickable in the prototype.
  // PLACEHOLDER PRICES: replace them with the prices from your Figma.
  const permit = {
    lot: "P7",
    name: "Student Permit – Lot P7",
    terms: [
      { label: "Academic Year 2026–27", price: 580 },
      { label: "Fall 2026", price: 310 },
      { label: "Winter 2027", price: 310 },
      { label: "Summer 2027", price: 200 },
    ],
  };

  const $select = $("#pd-term-select");
  permit.terms.forEach(function (term, index) {
    $("<option>").val(index).text(term.label).appendTo($select);
  });

  function selectedTerm() {
    return permit.terms[Number($select.val())];
  }

  // Shows the chosen term's price on both screens.
  function showTerm() {
    const term = selectedTerm();
    const priceText = "$" + term.price + " + HST";
    $("#lot-price").text(priceText);
    $("#pd-term").text(term.label);
    $("#pd-cost").text(priceText);
  }

  // Read the vehicle each time, because it can be added on this same page.
  function showVehicle() {
    $("#pd-vehicle").text(Transaction.describeVehicle(Transaction.getVehicle()));
    if (Transaction.getVehicle()) {
      $("#pd-no-vehicle").prop("hidden", true);
    }
  }

  $("#pd-name").text(permit.name);
  $("#pd-lot").text(permit.lot);
  showVehicle();
  showTerm();

  $select.on("change", showTerm);
  $(document).on("vehicle:saved", showVehicle); // sent by vehicle-form.js

  $("#pd-reserve").on("click", function () {
    const vehicle = Transaction.getVehicle();
    // Error path: a permit can't be reserved without a vehicle (e.g. the user
    // opened permits.html#permit-map directly and skipped the vehicle step).
    if (!vehicle) {
      $("#pd-no-vehicle").prop("hidden", false);
      return;
    }
    const term = selectedTerm();
    Transaction.saveReservation({
      lot: permit.lot,
      name: permit.name,
      term: term.label,
      vehicle: Transaction.describeVehicle(vehicle),
      price: term.price,
    });
    window.location.href = "cart.html";
  });
});
