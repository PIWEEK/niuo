import { getScrapbook } from "./endpoints/scrapbooks.endpoint";

const generatePages = () => {
  const pages = getScrapbook();

  const pagesList = document.querySelector('[data-query="pages-list"]');

  pages.forEach((page) => {
    console.log({ page });
    const pageEl = document.createElement("div");
    pageEl.classList.add("card");
    pageEl.setAttribute("data-type", page.type);
    pagesList.append(pageEl);
  });
};

generatePages();
