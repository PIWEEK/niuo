import { getScrapbook } from "../endpoints/scrapbooks.endpoint";
import { createPage } from "../endpoints/pages.endpoint";
import { buildActivityPage } from "../types/activity-checklist";
import { buildCoverPage } from "../types/cover";

import { buildEmotionsPage } from "../types/emotions";
import { buildColorPage } from "../types/color";
import { buildTextImagePage } from "../types/textImage";

import { pageMock } from "../mocks/pages.mock";

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
    <li><strong>Viaje a:</strong> <span data-query="scrapbook-data-destination">${scrapbook.where}</span></li>
    <li><strong>Fecha:</strong> ${scrapbook.when} </li>
    <li><strong>Viajan:</strong> <span data-query="scrapbook-data-child"> ${scrapbook.who} </span></li>
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

  scrapbook.pages.forEach((page, index) => {
    const pageEl = document.createElement("div");
    pageEl.classList.add("body-content");
    pageEl.classList.add(`tpl-${page.type}`);
    pageEl.setAttribute("data-index", index);

    switch (page.type) {
      case "cover":
        buildCoverPage(pageEl, scrapbook);
        break;

      case "activity_checklist":
        buildActivityPage(pageEl, page, index, scrapbook);
        break;

      case "emotions":
        buildEmotionsPage(pageEl, page, index, scrapbook);
        break;

      case "color":
        buildColorPage(pageEl, page, index, scrapbook);
        break;

      case "text_image":
        buildTextImagePage(pageEl, page, index, scrapbook);
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

const scrolltoCard = (event) => {
  const idx = event.currentTarget.getAttribute("data-index");
  const card = document.querySelector(`.body-inner .body-content[data-index='${idx}']`)
  card.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
};

const initAddCard = () => {
  const addCardBtn = document.getElementById("add-card");
  const cardPopup = document.querySelector(".new-card-popup");
  
  addCardBtn.addEventListener("click", (event) => {
    if (cardPopup.style.display === "grid") {
      cardPopup.style.display = "none";
    } else {
      cardPopup.style.display = "grid";
    }
  });

  document.addEventListener("click", (event) => {
    if (!addCardBtn.contains(event.target) &&
        !cardPopup.contains(event.target)) {
      cardPopup.style.display = "none";
    }
  });

  const newCardButtons = document.querySelectorAll(".new-card-popup .card");
  for (const cardButton of newCardButtons) {

    cardButton.addEventListener("click", async (event) => {
      const result = await createPage(scrapbook.id, {
        type: cardButton.getAttribute("data-type")
      });
      scrapbook = result;
      cardPopup.style.display = "none";
      update();

      const card = document.querySelector(`.body-inner .body-content:last-child`)
      card.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
    });

   
  }
};

// INIT

const init = async () => {
  const params = new URLSearchParams(window.location.search);
  scrapbook = await getScrapbook(params.get("id"));

  initScrapbookData();
  initPagesList();
  initMainCards();
  initPrintListener();
  initAddCard();
};

const update = async() => {
  const pagesList = document.querySelector('[data-query="pages-list"]');
  const pageCard = document.querySelector('[data-query="template-card"]');
  pageCard.innerHTML = '';
  pagesList.innerHTML = '';
  
  initScrapbookData();
  initPagesList();
  initMainCards();
};

init();
