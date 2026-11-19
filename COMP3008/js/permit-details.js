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

  const vehicle = Transaction.getVehicle();
  let vehicleText = "No vehicle added";
  if (vehicle) {
    vehicleText = vehicle.make + " " + vehicle.model + " · " + vehicle.plate;
  }

  $("#pd-name").text(permit.name);
  $("#pd-lot").text(permit.lot);
  $("#pd-vehicle").text(vehicleText);
  showTerm();

  $select.on("change", showTerm);

  $("#pd-reserve").on("click", function () {
    const term = selectedTerm();
    Transaction.saveReservation({
      lot: permit.lot,
      name: permit.name,
      term: term.label,
      vehicle: vehicleText,
      price: term.price,
    });
    window.location.href = "cart.html";
  });
});
