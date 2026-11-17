$(function () {
  function showScreen(name) {
    $(".screen").removeClass("active");
    $('.screen[data-screen="' + name + '"]').addClass("active");
  }

  $(document).on("click", "[data-goto]", function (e) {
    e.preventDefault();
    showScreen($(this).data("goto"));
  });
});
