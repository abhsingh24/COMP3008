// Add vehicle form (permits.html, "vehicle-form" screen): checks each field,
// shows errors next to the fields, and saves the vehicle with Transaction.
$(function () {
  const FIELDS = ["plate", "province", "make", "model", "colour"];
  const NAMES = {
    plate: "Licence plate",
    province: "Province or state",
    make: "Make",
    model: "Model",
    colour: "Colour",
  };

  // Same as main.js: show one screen and hide the others.
  function showScreen(name) {
    $(".screen").removeClass("active");
    $('.screen[data-screen="' + name + '"]').addClass("active");
  }

  // "abcd-123 " -> "ABCD 123"
  function cleanPlate(value) {
    return value.trim().toUpperCase().replace(/[-\s]+/g, " ");
  }

  function readForm() {
    return {
      plate: cleanPlate($("#vf-plate").val()),
      province: $("#vf-province").val(),
      make: $("#vf-make").val().trim(),
      model: $("#vf-model").val().trim(),
      colour: $("#vf-colour").val().trim(),
    };
  }

  // Returns { field: message } for every field that is wrong.
  function validate(v) {
    const errors = {};
    const plateChars = v.plate.replace(/ /g, "");
    if (plateChars === "") {
      errors.plate = "Enter your licence plate.";
    } else if (!/^[A-Z0-9 ]+$/.test(v.plate)) {
      errors.plate = "Use only letters and numbers.";
    } else if (plateChars.length < 2 || plateChars.length > 8) {
      errors.plate = "A plate has 2 to 8 letters or numbers.";
    }
    if (v.province === "") {
      errors.province = "Choose the province or state on the plate.";
    }
    if (v.make === "") {
      errors.make = "Enter the make, for example Honda.";
    }
    if (v.model === "") {
      errors.model = "Enter the model, for example Civic.";
    }
    if (v.colour === "") {
      errors.colour = "Enter the colour.";
    } else if (/\d/.test(v.colour)) {
      errors.colour = "A colour can't contain numbers.";
    }
    return errors;
  }

  function setError(field, message) {
    const $input = $("#vf-" + field);
    if (message) {
      $input.attr("aria-invalid", "true");
      $("#vf-" + field + "-error").text(message);
    } else {
      $input.removeAttr("aria-invalid");
      $("#vf-" + field + "-error").text("");
    }
  }

  function clearErrors() {
    FIELDS.forEach(function (field) {
      setError(field, null);
    });
    $("#vf-summary").prop("hidden", true).text("");
  }

  // Fill the form with the saved vehicle (for "Edit vehicle").
  function fillForm(vehicle) {
    $("#vf-plate").val(vehicle ? vehicle.plate : "");
    $("#vf-province").val(vehicle ? vehicle.province : "");
    $("#vf-make").val(vehicle ? vehicle.make : "");
    $("#vf-model").val(vehicle ? vehicle.model : "");
    $("#vf-colour").val(vehicle ? vehicle.colour : "");
  }

  // Update every place on this page that shows the vehicle.
  function showSavedVehicle() {
    const vehicle = Transaction.getVehicle();
    if (vehicle) {
      const text = Transaction.describeVehicle(vehicle) + " (" + vehicle.province + ")";
      $("#vehicle-status").text(text);
      $("#vehicle-saved-msg").text("Vehicle saved: " + text);
      $("#vehicle-add-btn").text("Edit vehicle");
      $("#vehicle-continue-btn").prop("hidden", false);
      $("#vf-title").text("Edit vehicle");
    }
  }

  $("#vf-form").on("submit", function (event) {
    event.preventDefault();
    const vehicle = readForm();
    const errors = validate(vehicle);

    let firstInvalid = null;
    let count = 0;
    FIELDS.forEach(function (field) {
      setError(field, errors[field]);
      if (errors[field]) {
        count++;
        if (!firstInvalid) {
          firstInvalid = field;
        }
      }
    });

    // Error path: stay on the form, say what's wrong, and move to the first problem.
    if (firstInvalid) {
      const list = FIELDS.filter(function (f) { return errors[f]; })
        .map(function (f) { return NAMES[f]; })
        .join(", ");
      $("#vf-summary")
        .text(count === 1
          ? "1 field needs fixing: " + list + "."
          : count + " fields need fixing: " + list + ".")
        .prop("hidden", false);
      $("#vf-" + firstInvalid).focus();
      return;
    }

    $("#vf-plate").val(vehicle.plate); // show the cleaned-up plate
    Transaction.saveVehicle(vehicle);
    clearErrors();
    showSavedVehicle();
    $(document).trigger("vehicle:saved"); // lets permit-details.js update
    showScreen("vehicle-added");
  });

  // Clear a field's error as soon as the user fixes it.
  FIELDS.forEach(function (field) {
    $("#vf-" + field).on("input change", function () {
      if ($(this).attr("aria-invalid") !== "true") {
        return;
      }
      const errors = validate(readForm());
      setError(field, errors[field]);
    });
  });

  // Opening the form (Add or Edit) starts from the saved vehicle with no old errors.
  $(document).on("click", '[data-goto="vehicle-form"]', function () {
    clearErrors();
    fillForm(Transaction.getVehicle());
    setTimeout(function () {
      $("#vf-plate").focus();
    }, 0);
  });

  fillForm(Transaction.getVehicle());
  showSavedVehicle();
});
