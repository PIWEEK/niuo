import { getScrapbook } from "./endpoints/scrapbooks.endpoint";

const scrapbook = getScrapbook();

const initCardListener = () => {
  const btnCards = document.querySelectorAll('[data-query="page-card"]');
  btnCards.forEach((btnCard) => {
    btnCard.addEventListener("click", buildMainCard);
  });
};

const buildMainCard = (event) => {
  const type = event.currentTarget.getAttribute("data-type");
  const index = event.currentTarget.getAttribute("data-index");

  switch (type) {
    case "cover":
      setPageIndex(index);
      buildCoverPage(index, type);
      break;

    case "activity_checklist":
      setPageIndex(index);
      break;

    default:
      console.error("this type does not exist");
      break;
  }
};

const setPageIndex = (index) => {
  const pageIndexEl = document.querySelector('[data-query="page-index"]');
  const indexNum = Number(index) + 1;
  pageIndexEl.textContent = `Página ${indexNum}`;
};

const buildCoverPage = (index, type) => {
  const page = scrapbook.pages[index];
  console.log({ page });
  const pageCard = document.querySelector('[data-query="template-card"]');
  pageCard.classList.remove();
  pageCard.classList.add("body-content", `tpl-${type}`);

  const coverPage = `
    <p class="font-ligature fs-3">Mi viaje a</p>
    <p class="font-ligature fs-5">${scrapbook.destination}</p>
    <p class="font-ligature fs-3">por</p>
    <p class="font-ligature fs-5">${scrapbook.people[0]}</p>
  `;

  pageCard.innerHTML = coverPage;
};

const init = () => {
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

init();
