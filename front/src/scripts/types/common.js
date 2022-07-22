
export const configPopup = (elem) => {
  const scrapbookId = elem.getAttribute("data-scrapbook");
  const page = elem.getAttribute("data-page");
  const index = elem.getAttribute("data-index");

  elem.addEventListener("click", (event) => {
    document.querySelector(".popup-wrapper").style.display = "block";
    window.popupData = { scrapbookId, page, index };
  });
};

