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
      const planSelect = document.querySelector("#plan");
      planSelect.value = button.dataset.plan;
      planSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
};

/**
 * Validates signup details, prevents duplicates, and saves accepted signups locally.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formStatus = document.querySelector("#form-status");
  const nameInput = signupForm.elements.namedItem("fullName");
  const emailInput = signupForm.elements.namedItem("email");
  const planInput = signupForm.elements.namedItem("plan");
  const termsInput = signupForm.elements.namedItem("terms");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fields = [
    { input: nameInput, error: document.querySelector("#full-name-error") },
    { input: emailInput, error: document.querySelector("#email-error") },
    { input: planInput, error: document.querySelector("#plan-error") },
    { input: termsInput, error: document.querySelector("#terms-error") },
  ];
  let hasSubmitted = false;

  const getFieldError = (input) => {
    if (input === nameInput && input.value.trim().length < 2) {
      return "Please enter at least 2 characters for your name.";
    }

    if (input === emailInput && !emailPattern.test(input.value.trim())) {
      return "Enter a valid email address.";
    }

    if (input === planInput && !input.value) {
      return "Choose a plan to continue.";
    }

    if (input === termsInput && !input.checked) {
      return "Please agree before sending your enquiry.";
    }

    return "";
  };

  const updateFieldError = (field) => {
    const message = getFieldError(field.input);
    field.error.textContent = message;
    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
    return !message;
  };

  const clearFieldError = (field) => {
    field.error.textContent = "";
    field.input.removeAttribute("aria-invalid");
  };

  fields.forEach((field) => {
    const eventName = field.input.type === "checkbox" || field.input.tagName === "SELECT" ? "change" : "input";

    field.input.addEventListener(eventName, () => {
      if (hasSubmitted) {
        updateFieldError(field);
      }

      formStatus.textContent = "";
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    hasSubmitted = true;
    formStatus.textContent = "";
    const isFormValid = fields.map(updateFieldError).every(Boolean);

    if (!isFormValid) {
      fields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
      return;
    }

    let signups;
    try {
      const storedSignups = localStorage.getItem("signups");
      signups = storedSignups === null ? [] : JSON.parse(storedSignups);
    } catch (error) {
      formStatus.textContent = "We couldn’t read saved signups from this browser. Check your browser storage settings and try again.";
      console.error("Unable to read signups from localStorage.", error);
      return;
    }

    if (
      !Array.isArray(signups)
      || signups.some((signup) => signup === null || typeof signup !== "object" || typeof signup.email !== "string")
    ) {
      formStatus.textContent = "Saved signup data is invalid. Clear the signups entry in browser storage before trying again.";
      return;
    }

    const email = emailInput.value.trim();
    const emailAlreadyExists = signups.some(
      (signup) => typeof signup.email === "string" && signup.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailAlreadyExists) {
      const emailField = fields.find((field) => field.input === emailInput);
      emailField.error.textContent = "This email address is already registered.";
      emailInput.setAttribute("aria-invalid", "true");
      formStatus.textContent = "You've already signed up";
      emailInput.focus();
      return;
    }

    const signup = {
      name: nameInput.value.trim(),
      email,
      plan: planInput.value,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("signups", JSON.stringify([...signups, signup]));
    } catch (error) {
      formStatus.textContent = "We couldn’t save your signup in this browser. Check available storage and try again.";
      console.error("Unable to save signup to localStorage.", error);
      return;
    }

    signupForm.reset();
    fields.forEach(clearFieldError);
    hasSubmitted = false;
    formStatus.textContent = "Thanks for signing up! Your details have been saved.";
  });
};

document.addEventListener("DOMContentLoaded", init);
