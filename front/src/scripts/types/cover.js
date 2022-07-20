import { modifyScrapbook } from "../endpoints/scrapbooks.endpoint";

const initCoverListeners = (element, scrapbook) => {
  const destinationInput = element.querySelector(
    '[data-query="destination-input"]'
  );
  const destinationChildName = element.querySelector(
    '[data-query="destination-child"]'
  );

  destinationInput.addEventListener("change", (event) => {
    document.querySelector(
      '[data-query="scrapbook-data-destination"]'
    ).innerHTML = event.currentTarget.value;
    // modifyScrapbook(scrapbook.id, {
    //   destination: event.currentTarget.value,
    // });
  });

  destinationChildName.addEventListener("change", (event) => {
    const childName = event.currentTarget.value;
    const peopleList = scrapbook.people;
    peopleList[0] = childName;
    document.querySelector(
      '[data-query="scrapbook-data-child"]'
    ).innerHTML = `${peopleList
      .join(", ")
      .replace(/, ([^,]*)$/, " y $1")} también </span>`;
  });
  //   modifyScrapbook(scrapbook.id, {
  //     people: peopleList,
  //   });
};

const buildCoverPage = (element, scrapbook) => {
  const coverPage = `
      <p class="font-ligature fs-3">Mi viaje a</p>
      <div>
        <input class="font-ligature fs-5" type="text" id="destination" data-query="destination-input" value="${scrapbook.destination}">
      </div>
      <p class="font-ligature fs-3">por</p>
      <div>
        <input class="font-ligature fs-5" type="text" id="people" data-query="destination-child" value="${scrapbook.people[0]}">
      </div>
    `;

  element.innerHTML = coverPage;
  initCoverListeners(element, scrapbook);
};

export { buildCoverPage };