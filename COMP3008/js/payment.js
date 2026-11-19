// Payment page: a simulated card payment. Nothing is sent anywhere, and the
// card number and CVC are never saved. Only the last 4 digits are kept.
$(function () {
  const DECLINE_CARD = "4000000000000002"; // test card that always fails
  const reservation = Transaction.getReservation();

  function showBlocked(message) {
    $("#pay-form").prop("hidden", true);
    $("#pay-blocked-msg").text(message);
    $("#pay-blocked").prop("hidden", false);
  }

  // Stop here if there's nothing to pay for or the hold has ended.
  if (!reservation) {
    $("#pay-summary").text("Your cart is empty.");
    showBlocked("There's nothing to pay for.");
    return;
  }

  const amount = Transaction.formatMoney(Transaction.getTotals(reservation.price).total);
  $("#pay-summary").text(reservation.name + " · Total " + amount);
  $("#pay-submit").text("Pay " + amount);

  if (Transaction.timeLeft(reservation) === 0) {
    showBlocked("Your 15-minute hold ended before payment, so the permit was released.");
    return;
  }

  // Luhn checksum: catches most typos in a card number.
  function passesLuhn(digits) {
    let sum = 0;
    let double = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = Number(digits[i]);
      if (double) {
        d = d * 2;
        if (d > 9) {
          d = d - 9;
        }
      }
      sum = sum + d;
      double = !double;
    }
    return sum % 10 === 0;
  }

  // "MM / YY" -> true if it's a real month that hasn't ended yet.
  function expiryIsValid(value) {
    const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value);
    if (!match) {
      return false;
    }
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) {
      return false;
    }
    // JavaScript months start at 0, so this is the 1st of the NEXT month:
    // the moment the card stops working.
    const cardStopsWorking = new Date(year, month, 1);
    return cardStopsWorking > new Date();
  }

  function validate(card, expiry, cvc) {
    const errors = {};
    if (!/^\d{13,19}$/.test(card) || !passesLuhn(card)) {
      errors.card = "Enter a valid card number.";
    }
    if (!expiryIsValid(expiry)) {
      errors.expiry = "Enter a future expiry date as MM / YY.";
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      errors.cvc = "Enter the 3 or 4 digit security code.";
    }
    return errors;
  }

  function setError(field, message) {
    const $input = $("#pay-" + field);
    if (message) {
      $input.attr("aria-invalid", "true");
      $("#pay-" + field + "-error").text(message);
    } else {
      $input.removeAttr("aria-invalid");
      $("#pay-" + field + "-error").text("");
    }
  }

  function showDeclined() {
    $("#pay-declined").prop("hidden", false);
  }

  $("#pay-form").on("submit", function (event) {
    event.preventDefault(); // stay on this page; we handle the submit ourselves
    $("#pay-declined").prop("hidden", true);

    // The hold could run out while the user is typing.
    const current = Transaction.getReservation();
    if (!current || Transaction.timeLeft(current) === 0) {
      showBlocked("Your 15-minute hold ended before payment, so the permit was released.");
      return;
    }

    const card = $("#pay-card").val().replace(/\s/g, "");
    const expiry = $("#pay-expiry").val().trim();
    const cvc = $("#pay-cvc").val().trim();

    const errors = validate(card, expiry, cvc);
    let firstInvalid = null;
    ["card", "expiry", "cvc"].forEach(function (field) {
      setError(field, errors[field]);
      if (errors[field] && !firstInvalid) {
        firstInvalid = field;
      }
    });
    if (firstInvalid) {
      $("#pay-" + firstInvalid).focus();
      return;
    }

    // Pretend to contact a payment processor. Disabling the button stops
    // a double click from paying twice.
    $("#pay-submit").prop("disabled", true).text("Processing…");
    setTimeout(function () {
      if (card === DECLINE_CARD) {
        showDeclined();
        $("#pay-submit").prop("disabled", false).text("Pay " + amount);
        return;
      }
      Transaction.completePayment(card.slice(-4));
      window.location.href = "success.html";
    }, 1200);
  });

  $("#pay-test-decline").on("click", function () {
    showDeclined();
  });
});