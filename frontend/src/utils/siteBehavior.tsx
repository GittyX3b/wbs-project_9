/* ScrollToElemtID - smooth scroling to given element id without changing page url */
/* Smooth scroll to element ID with dynamic header height */
export const scrollToElementID = (id: string) => {
  const element = document.getElementById(id);
  const header = document.querySelector('header');

  if (!element) return;

  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({
    top: elementTop - headerHeight,
    behavior: 'smooth',
  });
};

/* Sleep - delay in ms */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
