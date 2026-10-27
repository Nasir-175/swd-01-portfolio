/**
 * Initializes every interactive landing-page feature after the document is ready.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initFooterYear();
  initPlanSelection();
  initSignupForm();
};

/**
 * Opens and closes the mobile navigation with its button, links, or Escape.
 */
const initMobileMenu = () => {
  const menuButton = document.querySelector(".header__menu-toggle");
  const nav = document.querySelector("#main-nav");

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("nav--open");
  };

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    nav.classList.toggle("nav--open", !isExpanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
};

/**
 * Animates FAQ panels and ensures that at most one answer is open.
 */
const initAccordion = () => {
  const questions = document.querySelectorAll(".faq__question");

  const setPanelExpanded = (question, expanded) => {
    const panel = document.getElementById(question.getAttribute("aria-controls"));
    question.setAttribute("aria-expanded", String(expanded));

    if (expanded) {
      panel.hidden = false;
      panel.style.height = "0px";
      panel.offsetHeight;
      panel.style.height = `${panel.scrollHeight}px`;
      return;
    }

    panel.style.height = `${panel.scrollHeight}px`;
    panel.offsetHeight;
    panel.style.height = "0px";
  };

  questions.forEach((question) => {
    const panel = document.getElementById(question.getAttribute("aria-controls"));

    panel.addEventListener("transitionend", (event) => {
      if (event.target !== panel || event.propertyName !== "height") {
        return;
      }

      if (question.getAttribute("aria-expanded") === "true") {
        panel.style.height = "auto";
      } else {
        panel.hidden = true;
      }
    });

    question.addEventListener("click", () => {
      const isExpanded = question.getAttribute("aria-expanded") === "true";

      questions.forEach((openQuestion) => {
        if (openQuestion !== question && openQuestion.getAttribute("aria-expanded") === "true") {
          setPanelExpanded(openQuestion, false);
        }
      });

      setPanelExpanded(question, !isExpanded);
    });
  });
};

/**
 * Switches displayed prices and billing labels between monthly and yearly plans.
 */
const initPricingToggle = () => {
  const toggle = document.querySelector(".billing-switch__control");
  const prices = document.querySelectorAll(".card__price-value");
  const billingLabels = document.querySelectorAll(".card__billing-label");
  const savingsBadge = document.querySelector(".billing-switch__saving");

  toggle.addEventListener("click", () => {
    const isYearly = toggle.getAttribute("aria-checked") !== "true";
    const billingPeriod = isYearly ? "yearly" : "monthly";

    toggle.setAttribute("aria-checked", String(isYearly));
    savingsBadge.hidden = !isYearly;

    prices.forEach((price) => {
      price.textContent = `$${price.dataset[billingPeriod]}`;
    });

    billingLabels.forEach((label) => {
      label.textContent = billingPeriod;
    });
  });
};

/**
 * Adds a shadow to the sticky header after the page scrolls more than 10 pixels.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".header");

  const updateHeaderShadow = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Updates the copyright year to the current calendar year.
 */
const initFooterYear = () => {
  document.querySelectorAll("#current-year").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
};

/**
 * Selects the matching signup plan when a pricing card's CTA is activated.
 */
const initPlanSelection = () => {
  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#plan").value = button.dataset.plan;
    });
  });
};

/**
 * Shows the demo confirmation after a valid signup form submission.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formStatus = document.querySelector("#form-status");

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks for your note! This demo form is ready to connect to your signup workflow.";
    signupForm.reset();
  });
};

document.addEventListener("DOMContentLoaded", init);
