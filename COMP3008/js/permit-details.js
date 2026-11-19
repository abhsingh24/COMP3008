// Permit details screen: fills in the permit card and handles "Reserve".
$(function () {
  // Only Lot P7 is clickable in the prototype, so it is the only permit for now.
  const permit = {
    lot: "P7",
    name: "Student Permit – Lot P7",
    term: "Academic Year 2026–27",
    price: 580,
  };

  const vehicle = Transaction.getVehicle();
  let vehicleText = "No vehicle added";
  if (vehicle) {
    vehicleText = vehicle.make + " " + vehicle.model + " · " + vehicle.plate;
  }

  $("#pd-name").text(permit.name);
  $("#pd-lot").text(permit.lot);
  $("#pd-term").text(permit.term);
  $("#pd-vehicle").text(vehicleText);
  $("#pd-cost").text("$" + permit.price + " + HST");

  $("#pd-reserve").on("click", function () {
    Transaction.saveReservation({
      lot: permit.lot,
      name: permit.name,
      term: permit.term,
      vehicle: vehicleText,
      price: permit.price,
    });
    window.location.href = "cart.html";
  });
});