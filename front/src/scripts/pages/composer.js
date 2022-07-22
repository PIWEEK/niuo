import { getScrapbook } from "../endpoints/scrapbooks.endpoint";
import { createPage } from "../endpoints/pages.endpoint";
import { uploadImage, uploadImageUrl } from "../endpoints/slots.endpoint";

import { buildActivityPage } from "../types/activity-checklist";
import { buildCoverPage } from "../types/cover";

import { buildEmotionsPage } from "../types/emotions";
import { buildColorPage } from "../types/color";
import { buildTextImagePage } from "../types/textImage";
import { buildTransportPage } from "../types/transport";

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

    const pageCard = document.createElement("div");
    pageCard.classList = "page-thumbnail";
    buildCard(pageCard, page, index);

    pageEl.append(pageCard);
    pagesList.append(pageEl);
  });

  initCardListener();
};

const buildCard = (pageCard, page, index) => {
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

    case "transport":
      buildTransportPage(pageEl, page, index, scrapbook);
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
};

const initMainCards = () => {
  const pageCard = document.querySelector('[data-query="template-card"]');

  scrapbook.pages.forEach((page, index) => {
    buildCard(pageCard, page, index);
  });
};

const initCardListener = () => {
  const btnCards = document.querySelectorAll('[data-query="page-card"]');

  btnCards.forEach((btnCard) => {
    btnCard.addEventListener("click", scrolltoCard);
  });
};

const scrolltoCard = (event) => {
  document
    .querySelectorAll('[data-query="page-card"]')
    .forEach((card) => card.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const idx = event.currentTarget.getAttribute("data-index");
  const card = document.querySelector(
    `.body-inner .body-content[data-index='${idx}']`
  );
  card.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
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
    if (
      !addCardBtn.contains(event.target) &&
      !cardPopup.contains(event.target)
    ) {
      cardPopup.style.display = "none";
    }
  });

  const newCardButtons = document.querySelectorAll(".new-card-popup .card");
  for (const cardButton of newCardButtons) {
    cardButton.addEventListener("click", async (event) => {
      const result = await createPage(scrapbook.id, {
        type: cardButton.getAttribute("data-type"),
      });
      scrapbook = result;
      cardPopup.style.display = "none";
      update();

      const card = document.querySelector(
        `.body-inner .body-content:last-child`
      );
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    });
  }
};

const updateImageSlotFile = async (event) => {
  const input = event.target;

  if (popupData) {
    const { scrapbookId, page, index } = popupData;
    await uploadImage(scrapbookId, page, index, event.target.files[0]);

    const imgs = document.querySelectorAll(
      `[for='checklist-input-image-${page}-${index}'] img`
    );
    for (const img of imgs) {
      img.src = `http://localhost:8000/api/scrapbooks/${scrapbookId}/pages/${page}/${index}/image`;
    }

    document.querySelector(".popup-wrapper").style.display = "none";
    window.popupData = null;
    event.target.value = "";
  }
};

const updateImageSlotUrl = async (url) => {
  if (popupData) {
    const { scrapbookId, page, index } = popupData;

    await uploadImageUrl(scrapbookId, page, index, url);

    const imgs = document.querySelectorAll(
      `[for='checklist-input-image-${page}-${index}'] img`
    );
    for (const img of imgs) {
      img.src = `http://localhost:8000/api/scrapbooks/${scrapbookId}/pages/${page}/${index}/image`;
    }

    document.querySelector(".popup-wrapper").style.display = "none";
    window.popupData = null;
  }
};

const initPopupHandlers = () => {
  const background = document.querySelector(".popup-wrapper .background");

  background.addEventListener("click", (event) => {
    document.querySelector(".popup-wrapper").style.display = "none";
    window.popupData = null;
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      document.querySelector(".popup-wrapper").style.display = "none";
      window.popupData = null;
    }
  });

  document
    .querySelector(".upload-image input")
    .addEventListener("change", updateImageSlotFile);

  const imageUrlInputButton = document.getElementById("imageUrlInputButton");
  const imageUrlInput = document.getElementById("imageUrlInput");
  imageUrlInputButton.addEventListener("click", async (event) => {
    const imageUrl = imageUrlInput.value;
    await updateImageSlotUrl(imageUrl);
    imageUrlInput.value = "";
  });

  const searchInput = document.querySelector("[name='searchQuery']");

  searchInput.addEventListener("keyup", async (event) => {
    const searchQuery = searchInput.value || "";

    if (searchQuery !== "") {
      const result = await fetch(
        `https://cocomaterial.com/api/vectors/?tags=${searchQuery}`
      );
      const data = await result.json();

      const resultNode = document.querySelector(".coco-material-results");

      if (data.results.length === 0) {
        resultNode.innerHTML =
          "<div class='empty'>No se ha encontrado nada</div>";
      } else {
        resultNode.innerHTML = "";
        for (const current of data.results) {
          const node = document.createElement("li");
          const img = document.createElement("img");

          img.src = current.coloredSvg || current.svg;

          node.append(img);
          resultNode.append(node);

          node.addEventListener("click", () => updateImageSlotUrl(img.src));
        }
      }
    }
  });
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
  initPopupHandlers();
};

const update = async () => {
  const pagesList = document.querySelector('[data-query="pages-list"]');
  const pageCard = document.querySelector('[data-query="template-card"]');
  pageCard.innerHTML = "";
  pagesList.innerHTML = "";

  initScrapbookData();
  initPagesList();
  initMainCards();
};

init();
