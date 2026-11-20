$(function () {
  const img = document.getElementById("timeline-img");

  const timeLineBypage = {
    "account-vehicle": "images/Timeline1.png",
    "vehicle-form": "images/Timeline1.png",
    "vehicle-added": "images/Timeline1.png",
    "permit-map": "images/Timeline2.png",
    "lot-permits": "images/Timeline2.png",
    "permit-details": "images/Timeline3.png",
    "sold-out": "images/Timeline3.png",
    cart: "images/Timeline4.png",
  };

  function updateTimeLine(name) {
    const src = timeLineBypage[name];
    if (src && img && !img.src.endsWith(src)) {
      img.src = src;
    }
  }

  function showScreen(name) {
    $(".screen").removeClass("active");
    $('.screen[data-screen="' + name + '"]').addClass("active");
    updateTimeLine(name);
  }

  $(document).on("click", "[data-goto]", function (e) {
    e.preventDefault();
    showScreen($(this).data("goto"));
  });

  function openFromLink() {
    const name = window.location.hash.slice(1);
    const exists =
      $(".screen").filter(function () {
        return $(this).attr("data-screen") === name;
      }).length > 0;
    if (exists) {
      showScreen(name);
    }
  }

  openFromLink();
  $(window).on("hashchange", openFromLink);
});
