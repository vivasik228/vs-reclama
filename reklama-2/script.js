(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  const cursorGlow = document.querySelector(".cursor-glow");
  const currentPage = document.body.dataset.page;
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const naruzhnayaPages = new Set([
    "naruzhnaya-reklama.html",
    "vyveski.html",
    "svetovye-koroba.html",
    "stendy.html",
    "tablichki.html",
    "ukazateli.html",
    "dop-uslugi.html",
    "montazh.html",
    "vyveski-svetovye-ne-svetovye.html",
    "vyveski-obemnye-kompozit.html",
    "vyveski-pseudo-obemnye.html",
    "vyveski-ploskie.html",
    "nashi-raboty-naruzhnaya.html",
  ]);
  const ohranaPages = new Set([
    "ohrana-truda.html",
    "znaki-tb-perechen.html",
    "plakaty-ohrana-perechen.html",
    "plany-evakuacii.html",
    "zayavka-iz-perechnya.html",
    "nashi-raboty-ohrana.html",
  ]);
  const markirovkaPages = new Set([
    "markirovka-trub.html",
    "lenty-markery.html",
    "otssylka-k-gostu.html",
    "nashi-raboty-markirovka.html",
  ]);
  const logotipyPages = new Set([
    "logotipy-odezhda.html",
    "termopechat.html",
    "dtf-pechat.html",
    "vyshivka.html",
    "kaski-kepki.html",
    "nashi-raboty-logotipy.html",
  ]);
  const navPage = naruzhnayaPages.has(currentFile)
    ? "naruzhnaya-reklama"
    : logotipyPages.has(currentFile)
      ? "logotipy-odezhda"
      : ohranaPages.has(currentFile)
        ? "ohrana-truda"
        : markirovkaPages.has(currentFile)
          ? "markirovka-trub"
          : currentPage;

  document
    .querySelectorAll(
      `.nav a[data-page="${navPage}"], .nav-dropdown__trigger[data-page="${navPage}"], .mobile-nav a[data-page="${navPage}"]`
    )
    .forEach((link) => link.classList.add("is-active"));

  document.querySelectorAll(".nav-dropdown__link, .mobile-nav-group__children > a").forEach((link) => {
    const href = link.getAttribute("href")?.split("?")[0];
    if (href === currentFile) link.classList.add("is-active");
  });

  function onScroll() {
    header?.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger?.addEventListener("click", () => {
    const open = burger.classList.toggle("is-open");
    mobileNav?.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burger?.classList.remove("is-open");
      mobileNav?.classList.remove("is-open");
      burger?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  document.querySelectorAll(".nav-dropdown__trigger").forEach((trigger) => {
    const dropdown = trigger.closest(".nav-dropdown");
    trigger.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 900px)").matches) return;
      e.preventDefault();
      const wasOpen = dropdown?.classList.contains("is-open");
      document.querySelectorAll(".nav-dropdown.is-open").forEach((item) => item.classList.remove("is-open"));
      if (!wasOpen) dropdown?.classList.add("is-open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (!e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown.is-open").forEach((item) => item.classList.remove("is-open"));
    }
  });

  document.querySelectorAll(".nav-subgroup__head").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const group = btn.closest(".nav-subgroup");
      group?.classList.toggle("is-open");
    });
  });

  document.querySelectorAll(".mobile-nav-group__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".mobile-nav-group");
      const isOpen = group?.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(!!isOpen));
    });
  });

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener(
      "mousemove",
      (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
      },
      { passive: true }
    );
  } else if (cursorGlow) {
    cursorGlow.remove();
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  const catalogContent = {
    "svetovye-ne-svetovye": {
      parent: "Вывески",
      title: "Световые и не световые",
      text: [
        "Изготавливаем световые и несветовые вывески для фасадов, витрин и входных групп.",
        "Световые варианты — с внутренней или контражурной подсветкой. Несветовые — для дневной видимости и экономичного оформления.",
        "Подбираем материалы и тип подсветки под бюджет и требования к размещению.",
      ],
    },
    "obemnye-kompozit": {
      parent: "Вывески",
      title: "Объёмные буквы на композите",
      text: [
        "Объёмные буквы из алюминиевого композита — прочное и лёгкое решение для наружной рекламы.",
        "Буквы выдерживают погодные условия, хорошо читаются с расстояния и подходят для крупных вывесок.",
        "Возможна подсветка лицевой части или контурная подсветка.",
      ],
    },
    "pseudo-obemnye": {
      parent: "Вывески",
      title: "Псевдообъёмные буквы",
      text: [
        "Псевдообъёмные буквы создают эффект объёма при меньшей глубине и стоимости.",
        "Отличный вариант для помещений, витрин и фасадов, где не требуется полноценный объём.",
        "Изготавливаем из ПВХ, акрила и композитных материалов.",
      ],
    },
    ploskie: {
      parent: "Вывески",
      title: "Плоские",
      text: [
        "Плоские вывески — таблички, панели и фризы без объёмных элементов.",
        "Используем композит, ПВХ, акрил и плёнку с полноцветной печатью.",
        "Подходят для указателей, информационных табличек и лаконичного оформления фасада.",
      ],
    },
    "svetovye-koroba": {
      title: "Световые короба",
      text: [
        "Изготавливаем световые короба с внутренней подсветкой для фасадов, витрин и торговых точек.",
        "Лицевая часть — из акрила, поликарбоната или баннера с качественной печатью.",
        "Корпус из алюминиевого профиля или композита, устойчив к погодным условиям.",
      ],
    },
    stendy: {
      title: "Стенды",
      text: [
        "Рекламные и информационные стенды для офисов, выставок, торговых залов и мероприятий.",
        "Мобильные, напольные и настенные конструкции из металла, пластика и баннера.",
        "Изготавливаем под заказ с учётом фирменного стиля и задач размещения.",
      ],
    },
    tablichki: {
      title: "Таблички",
      text: [
        "Фасадные, дверные и офисные таблички с названием организации, режимом работы и контактами.",
        "Материалы: композит, ПВХ, акрил, металл, латунь и пластик.",
        "Возможна гравировка, печать и объёмные элементы.",
      ],
    },
    ukazateli: {
      title: "Указатели",
      text: [
        "Навигационные указатели для зданий, территорий, парковок и производственных объектов.",
        "Стрелки, планшеты и консольные указатели со световозвращающей или контрастной маркировкой.",
        "Помогаем с размещением и единым стилем навигации.",
      ],
    },
    "dop-uslugi": {
      title: "Дополнительные услуги",
      text: [
        "Разработка макетов, согласование размещения, доставка и сопутствующие рекламные работы.",
        "Помогаем подобрать материалы, размеры и вариант конструкции под бюджет.",
        "Консультируем по оформлению фасада и комплексному брендированию объекта.",
      ],
    },
    montazh: {
      title: "Монтажные работы",
      text: [
        "Профессиональный монтаж вывесок, световых коробов, стендов и рекламных конструкций.",
        "Работаем на высоте с соблюдением требований безопасности.",
        "Монтаж на фасады, крыши, витрины и внутренние помещения.",
      ],
    },
    termopechat: {
      section: "Логотипы на одежду",
      title: "Термопечать",
      text: [
        "Наносим логотипы термопереносом на футболки, толстовки, спецодежду и корпоративный мерч.",
        "Подходит для небольших и средних тиражей, яркие цвета и чёткие мелкие детали.",
        "Помогаем подготовить макет и подобрать расположение нанесения.",
      ],
    },
    "dtf-pechat": {
      section: "Логотипы на одежду",
      title: "DTF-печать",
      text: [
        "Печатаем логотипы технологией DTF — на хлопке, смесовых тканях и трикотаже.",
        "Устойчивое нанесение с насыщенными цветами и плавными переходами.",
        "Оптимально для многоцветных макетов и тиражей разного объёма.",
      ],
    },
    vyshivka: {
      section: "Логотипы на одежду",
      title: "Вышивка",
      text: [
        "Вышиваем логотипы и надписи на форме, куртках, рубашках и головных уборах.",
        "Премиальный вид, высокая износостойкость — для униформы и корпоративной одежды.",
        "Подбираем тип нити и размер вышивки под ткань и фирменный стиль.",
      ],
    },
    "kaski-kepki": {
      section: "Логотипы на одежду",
      title: "Каски/кепки",
      text: [
        "Наносим логотипы на каски, кепки, бейсболки и другие головные уборы.",
        "Термопечать, вышивка и DTF — в зависимости от материала и задачи.",
        "Подходит для строительных бригад, промышленных предприятий и промо-мерча.",
      ],
    },
  };

  const catalogPanel = document.getElementById("catalog-panel");

  function showCatalogItem(id) {
    if (!catalogPanel) return;
    const item = catalogContent[id];
    if (!item) return;

    const sectionName = item.section || (logotipyPages.has(currentFile) ? "Логотипы на одежду" : "Наружная реклама");
    const crumb = item.parent
      ? `${sectionName} / ${item.parent} / ${item.title}`
      : `${sectionName} / ${item.title}`;

    catalogPanel.innerHTML = `
      <p class="catalog-panel__crumb">${crumb}</p>
      <h2 class="catalog-panel__title">${item.title}</h2>
      ${item.text.map((p) => `<p>${p}</p>`).join("")}
      <p class="catalog-panel__order">Заказать: <a href="mailto:v-s-reklama@mail.ru">v-s-reklama@mail.ru</a> · <a href="tel:+73517710511">(351) 771-05-11</a></p>
    `;
    catalogPanel.classList.add("is-filled");
  }

  document.querySelectorAll(".catalog-tab--link").forEach((link) => {
    const href = link.getAttribute("href")?.split("?")[0];
    if (href === currentFile) link.classList.add("is-active");
  });

  document.querySelectorAll(".catalog-tab[data-catalog-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".catalog-tab[data-catalog-id]").forEach((tab) => tab.classList.remove("is-active"));
      btn.classList.add("is-active");
      if (btn.dataset.catalogId) showCatalogItem(btn.dataset.catalogId);
    });
  });

  document.querySelectorAll(".catalog-subtab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".catalog-subtab").forEach((tab) => tab.classList.remove("is-active"));
      btn.classList.add("is-active");
      showCatalogItem(btn.dataset.catalogId);
    });
  });

  document.querySelectorAll(".mobile-nav-subgroup__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".mobile-nav-subgroup");
      const isOpen = group?.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(!!isOpen));
    });
  });

  /* Hero slider (главная) */
  const heroSlider = document.querySelector(".hero-slider");
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll(".hero-slide");
    const dotsWrap = heroSlider.querySelector(".hero-slider__dots");
    const prevBtn = heroSlider.querySelector(".hero-slider__btn--prev");
    const nextBtn = heroSlider.querySelector(".hero-slider__btn--next");
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-slider__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Слайд " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap?.appendChild(dot);
    });

    const dots = heroSlider.querySelectorAll(".hero-slider__dot");

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    prevBtn?.addEventListener("click", () => { prev(); resetTimer(); });
    nextBtn?.addEventListener("click", () => { next(); resetTimer(); });

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    resetTimer();
  }

  const initialCatalogId = new URLSearchParams(window.location.search).get("item");
  if (initialCatalogId && catalogContent[initialCatalogId]) {
    document.querySelector(`.catalog-subtab[data-catalog-id="${initialCatalogId}"]`)?.click();
  } else {
    const pageCatalogId = document.body.dataset.catalogId;
    if (pageCatalogId && catalogContent[pageCatalogId]) {
      showCatalogItem(pageCatalogId);
    }
  }
})();
