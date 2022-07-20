import { getScrapbook } from "../endpoints/scrapbooks.endpoint";
// import { buildActivityPage } from "../types/activity-checklist";
// import { buildCoverPage } from "../types/cover";

let scrapbook = getScrapbook();

// Init zero state

const initScrapbookData = () => {
  const scrapbookData = document.querySelector('[data-query="scrapbook-data"]');
  const data = `
    <li><strong>Viaje a:</strong> <span data-query="scrapbook-data-destination">${
      scrapbook.destination
    }</span></li>
    <li><strong>Fecha:</strong> ${scrapbook.dateStart.toDateString()} - ${scrapbook.dateFinish.toDateString()} </li>
    <li><strong>Viajan:</strong> <span data-query="scrapbook-data-child"> ${scrapbook.people
      .join(", ")
      .replace(/, ([^,]*)$/, " y $1")} también </span>
    </li>
  `;
  scrapbookData.innerHTML = data;
};

const initPagesList = () => {
  const pagesList = document.querySelector('[data-query="pages-list"]');

  scrapbook.pages.forEach((page, index) => {
    const pageEl = document.createElement("button");
    pageEl.classList.add("card");
    pageEl.setAttribute("data-type", page.type);
    pageEl.setAttribute("data-query", "page-card");
    pageEl.setAttribute("data-index", index);
    pagesList.append(pageEl);
  });

  initCardListener();
};

const initMainCards = () => {
  // setPageIndex(0);
  // setPageClass("cover");
  // buildCoverPage(scrapbook);
  buildCards(scrapbook);
};

const initCardListener = () => {
  const btnCards = document.querySelectorAll('[data-query="page-card"]');
  btnCards.forEach((btnCard) => {
    btnCard.addEventListener("click", scrolltoCard);
  });
};

const scrolltoCard = () => {
  console.log("scrolltoCard");
};

// Main Card types

// const buildMainCard = (event) => {
//   const type = event.currentTarget.getAttribute("data-type");
//   const index = event.currentTarget.getAttribute("data-index");
//   scrapbook = getScrapbook();

//   setPageIndex(index);
//   setPageClass(type);

//   switch (type) {
//     case "cover":
//       buildCoverPage(scrapbook);
//       break;

//     case "activity_checklist":
//       buildActivityPage(scrapbook);
//       break;

//     default:
//       console.error("this type does not exist");
//       break;
//   }
// };

// const setPageIndex = (index) => {
//   const pageIndexEl = document.querySelector('[data-query="page-index"]');
//   const indexNum = Number(index) + 1;
//   pageIndexEl.textContent = `Página ${indexNum}`;
// };

// const setPageClass = (type) => {
//   const pageCard = document.querySelector('[data-query="template-card"]');
//   pageCard.classList.remove();
//   pageCard.classList.add("body-content", `tpl-${type}`);
// };

// INIT

const init = () => {
  initScrapbookData();
  initPagesList();
  initMainCards();
};

init();
