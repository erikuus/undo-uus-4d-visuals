import { explainerSlides } from "./slides";
import type { AnimationController } from "./types";

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function initLandingExplainer(container: HTMLElement): () => void {
  const trigger = container.querySelector(".explainer-trigger");
  const modal = container.querySelector(".explainer-modal");
  const backdrop = container.querySelector(".explainer-modal__backdrop");
  const closeButton = container.querySelector(".explainer-modal__close");
  const prevButton = container.querySelector(".explainer-nav--prev");
  const nextButton = container.querySelector(".explainer-nav--next");
  const canvas = container.querySelector(".explainer-canvas");
  const slideTitle = container.querySelector(".explainer-slide__title");
  const slideBody = container.querySelector(".explainer-slide__body");
  const slidePrompt = container.querySelector(".explainer-slide__prompt");
  const slideAnswer = container.querySelector(".explainer-slide__answer");
  const slideQuote = container.querySelector(".explainer-slide__quote");
  const slideFooter = container.querySelector(".explainer-slide__footer");
  const indicator = container.querySelector(".explainer-modal__indicator");
  const dialog = container.querySelector(".explainer-modal__dialog");

  if (
    !(trigger instanceof HTMLButtonElement) ||
    !(modal instanceof HTMLElement) ||
    !(backdrop instanceof HTMLElement) ||
    !(closeButton instanceof HTMLButtonElement) ||
    !(prevButton instanceof HTMLButtonElement) ||
    !(nextButton instanceof HTMLButtonElement) ||
    !(canvas instanceof HTMLCanvasElement) ||
    !(slideTitle instanceof HTMLElement) ||
    !(slideBody instanceof HTMLElement) ||
    !(slidePrompt instanceof HTMLElement) ||
    !(slideAnswer instanceof HTMLElement) ||
    !(slideQuote instanceof HTMLElement) ||
    !(slideFooter instanceof HTMLElement) ||
    !(indicator instanceof HTMLElement) ||
    !(dialog instanceof HTMLElement)
  ) {
    return () => {};
  }

  let currentIndex = 0;
  let animation: AnimationController | null = null;
  let isOpen = false;
  let previousFocus: HTMLElement | null = null;

  const destroyAnimation = () => {
    animation?.destroy();
    animation = null;
  };

  const focusableSelector = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(", ");

  const renderSlide = (index: number) => {
    currentIndex = index;
    const slide = explainerSlides[index];

    slideTitle.textContent = slide.title;
    slideBody.textContent = slide.body;
    slideTitle.hidden = slide.title.length === 0;
    slideBody.hidden = slide.body.length === 0;
    slidePrompt.textContent = slide.prompt;
    slideAnswer.textContent = slide.answer;
    indicator.textContent = `${index + 1} / ${explainerSlides.length}`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === explainerSlides.length - 1;

    if (slide.quote) {
      slideQuote.textContent = slide.quote;
      slideQuote.hidden = false;
    } else {
      slideQuote.hidden = true;
      slideQuote.textContent = "";
    }

    if (slide.footerNote) {
      slideFooter.textContent = slide.footerNote;
      slideFooter.hidden = false;
    } else {
      slideFooter.hidden = true;
      slideFooter.textContent = "";
    }

    destroyAnimation();
    animation = slide.createAnimation(canvas);
  };

  const closeModal = () => {
    if (!isOpen) return;

    isOpen = false;
    destroyAnimation();
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleKeydown);

    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    } else {
      trigger.focus();
    }
  };

  const openModal = () => {
    previousFocus = isHTMLElement(document.activeElement)
      ? document.activeElement
      : null;
    isOpen = true;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    renderSlide(0);
    document.addEventListener("keydown", handleKeydown);
    window.requestAnimationFrame(() => {
      closeButton.focus();
    });
  };

  const stepSlide = (direction: number) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= explainerSlides.length) {
      return;
    }
    renderSlide(nextIndex);
  };

  const trapFocus = (event: KeyboardEvent) => {
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((element) => !element.hasAttribute("hidden"));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function handleKeydown(event: KeyboardEvent): void {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepSlide(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepSlide(-1);
      return;
    }

    if (event.key === "Tab") {
      trapFocus(event);
    }
  }

  const onResize = () => animation?.resize();
  const onTriggerClick = () => openModal();
  const onPrevClick = () => stepSlide(-1);
  const onNextClick = () => stepSlide(1);
  const onBackdropClick = () => closeModal();

  trigger.addEventListener("click", onTriggerClick);
  closeButton.addEventListener("click", closeModal);
  prevButton.addEventListener("click", onPrevClick);
  nextButton.addEventListener("click", onNextClick);
  backdrop.addEventListener("click", onBackdropClick);
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
    document.removeEventListener("keydown", handleKeydown);
    trigger.removeEventListener("click", onTriggerClick);
    closeButton.removeEventListener("click", closeModal);
    prevButton.removeEventListener("click", onPrevClick);
    nextButton.removeEventListener("click", onNextClick);
    backdrop.removeEventListener("click", onBackdropClick);
    document.body.classList.remove("modal-open");
    destroyAnimation();
  };
}
