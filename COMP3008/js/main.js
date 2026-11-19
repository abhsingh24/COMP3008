$(function () {
  function showScreen(name) {
    $(".screen").removeClass("active");
    $('.screen[data-screen="' + name + '"]').addClass("active");
  }

  $(document).on("click", "[data-goto]", function (e) {
    e.preventDefault();
    showScreen($(this).data("goto"));
  });

  // Open the screen named in the link, e.g. permits.html#permit-map
  function openFromLink() {
    const name = window.location.hash.slice(1);
    const exists = $(".screen").filter(function () {
      return $(this).attr("data-screen") === name;
    }).length > 0;
    if (exists) {
      showScreen(name);
    }
  }

  openFromLink();
  $(window).on("hashchange", openFromLink);
});
