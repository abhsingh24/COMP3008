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

  const OVERLAPRES = {
    "Academic Year 2026–27": [
      "Academic Year 2026–27",
      "Fall 2026",
      "Winter 2027",
    ],
    "Fall 2026": ["Fall 2026", "Academic Year 2026–27"],
    "Winter 2027": ["Winter 2027", "Academic Year 2026–27"],
    "Summer 2027": ["Summer 2027"],
  };

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
    check();
  }

  // Read the vehicle each time, because it can be added on this same page.
  function showVehicle() {
    $("#pd-vehicle").text(
      Transaction.describeVehicle(Transaction.getVehicle()),
    );
    if (Transaction.getVehicle()) {
      $("#pd-no-vehicle").prop("hidden", true);
    }
    check();
  }

  function findConflictingRes() {
    const vehicle = Transaction.getVehicle();
    if (!vehicle) {
      return undefined;
    }

    const vehicleText = Transaction.describeVehicle(vehicle);
    const blockers = OVERLAPRES[selectedTerm().label];
    return Transaction.getPermits().find(function (p) {
      return (
        p.lot === permit.lot &&
        p.vehicle === vehicleText &&
        blockers.indexOf(p.term) !== -1
      );
    });
  }

  function check() {
    const owned = findConflictingRes();
    if (owned) {
      $("#pd-duplicate")
        .text(
          "You already have a Lot " +
            permit.lot +
            " permit for " +
            owned.term +
            " on this vehicle, which covers this term. Choose a different term or vehicle.",
        )
        .prop("hidden", false);
    } else {
      $("#pd-duplicate").prop("hidden", true).text("");
    }
    $("#pd-reserve").prop("disabled", Boolean(owned));
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
    if (findConflictingRes()) {
      check();
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
