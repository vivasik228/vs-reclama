(function () {
  var themes = {
    cream: { file: "styles.css", fonts: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" },
    midnight: { file: "themes/midnight.css", fonts: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" },
    arctic: { file: "themes/arctic.css", fonts: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    pop: { file: "themes/pop.css", fonts: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap" }
  };

  var params = new URLSearchParams(window.location.search);
  var theme = params.get("theme") || localStorage.getItem("vs-theme") || "cream";
  if (!themes[theme]) theme = "cream";

  if (params.get("theme")) localStorage.setItem("vs-theme", theme);

  var cfg = themes[theme];
  if (theme !== "cream") {
    var base = document.querySelector('link[rel="stylesheet"][href="styles.css"]');
    if (base) base.href = cfg.file;
  }

  document.querySelectorAll('link[data-theme-fonts]').forEach(function (n) { n.remove(); });
  var font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = cfg.fonts;
  font.setAttribute("data-theme-fonts", theme);
  document.head.appendChild(font);
})();
