import { modifyScrapbook } from "../endpoints/scrapbooks.endpoint";

const initCoverListeners = (element, scrapbook) => {
  const destinationInput = element.querySelector(
    '[data-query="destination-input"]'
  );

  const destinationChildName = element.querySelector(
    '[data-query="destination-child"]'
  );

  destinationInput.addEventListener("change", (event) => {
    const nodes = document.querySelectorAll(
      '[data-query="scrapbook-data-destination"]'
    );

    for (const node of nodes) {
      node.innerHTML = event.currentTarget.value;
    }

    scrapbook.where = event.currentTarget.value
    modifyScrapbook(scrapbook.id, scrapbook);
  });

  destinationChildName.addEventListener("change", (event) => {
    const childNameInput = event.currentTarget.value;
    const nodes = document.querySelectorAll('[data-query="scrapbook-data-child"]')

    for (const node of nodes) {
      node.innerHTML = childNameInput;
    }

    scrapbook.who = childNameInput;
    modifyScrapbook(scrapbook.id, scrapbook);
  });
};

const buildCoverPage = (element, scrapbook) => {
  const coverPage = `
      <p class="font-ligature fs-2">Mi viaje a</p>
      <div>
        <input class="font-ligature fs-4" type="text" id="destination" data-query="destination-input" value="${scrapbook.where}">
      </div>
      <p class="font-ligature fs-2">por</p>
      <div>
        <input class="font-ligature fs-4" type="text" id="people" data-query="destination-child" value="${scrapbook.who}">
      </div>
      <img class="bg-ilu ilu-quokka" src="${new URL(
        "../../assets/quokka_travel.svg",
        import.meta.url
      )}" alt="">
      <img class="bg-ilu ilu-plane" src="${new URL(
        "../../assets/paper_plane_flying.svg",
        import.meta.url
      )}" alt="">
    `;

  element.innerHTML = coverPage;
  initCoverListeners(element, scrapbook);
};

export { buildCoverPage };
