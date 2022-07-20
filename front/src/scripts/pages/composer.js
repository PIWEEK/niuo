import { getScrapbook } from "../endpoints/scrapbooks.endpoint";
// import { buildActivityPage } from "../types/activity-checklist";
import { buildCoverPage } from "../types/cover";

let scrapbook;

// Init zero state

const initPrintListener = () => {
  const printBtn = document.querySelector('[data-query="print-btn"]');
  printBtn.addEventListener("click", () => {
    print();
  });
};

const initScrapbookData = () => {
  const scrapbookData = document.querySelector('[data-query="scrapbook-data"]');
  const data = `
    <li><strong>Viaje a:</strong> <span data-query="scrapbook-data-destination">${
      scrapbook.destination
    }</span></li>
    <li><strong>Fecha:</strong> ${scrapbook.dateStart} - ${scrapbook.dateFinish} </li>
    <li><strong>Viajan:</strong> <span data-query="scrapbook-data-child"> ${scrapbook.people?
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
  const pageCard = document.querySelector('[data-query="template-card"]');
  console.log(scrapbook.pages);
  scrapbook.pages.forEach((page) => {
    const pageEl = document.createElement("div");
    pageEl.classList.add("body-content");
    pageEl.classList.add(`tpl-${page.type}`);
    switch (page.type) {
      case "cover":
        buildCoverPage(pageEl, scrapbook);
        break;

      case "activity_checklist":
        // buildActivityPage(pageEl, scrapbook);
        break;

      default:
        console.error("this type does not exist");
        break;
    }
    pageCard.append(pageEl);
  });
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

// INIT

const init = async () => {
  scrapbook = await getScrapbook("c76ff7b8-9893-4bad-9cf8-afbe5884892c");

  initScrapbookData();
  initPagesList();
  initMainCards();
  initPrintListener();
};

init();
