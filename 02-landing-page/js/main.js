const billingOptions = document.querySelectorAll(".billing-toggle__option");
const priceValues = document.querySelectorAll(".card__price-value");
const billingLabels = document.querySelectorAll(".card__billing-label");

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const billingPeriod = option.dataset.billing;

    billingOptions.forEach((billingOption) => {
      const isActive = billingOption === option;
      billingOption.classList.toggle("billing-toggle__option--active", isActive);
      billingOption.setAttribute("aria-pressed", String(isActive));
    });

    priceValues.forEach((price) => {
      price.textContent = `$${price.dataset[billingPeriod]}`;
    });
    billingLabels.forEach((label) => {
      label.textContent = billingPeriod;
    });
  });
});

document.querySelectorAll(".faq__question").forEach((question) => {
  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(question.getAttribute("aria-controls"));

    question.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    const planSelect = document.getElementById("plan");
    planSelect.value = button.dataset.plan;
  });
});

const signupForm = document.getElementById("signup-form");
const formStatus = document.getElementById("form-status");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks for your note! This demo form is ready to connect to your signup workflow.";
  signupForm.reset();
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());
