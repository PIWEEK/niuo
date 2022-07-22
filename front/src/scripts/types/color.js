import {configPopup} from "./common";

const buildColorPage = (pageEl, page, index, scrapbook) => {
  const summary = document.createElement("div");
  summary.classList = "summary";
  summary.textContent = `El viaje de ${scrapbook.who} a  ${scrapbook.where}`;
  pageEl.append(summary);

  const pinImageEl = document.createElement("img");
  const pinImageSVG = new URL(
    "../../assets/pin.svg",
    import.meta.url
  );
  pinImageEl.src = pinImageSVG;
  summary.append(pinImageEl);


  const intro = document.createElement("p");
  intro.classList = "font-ligature intro";
  intro.textContent = "¡A colorear!";
  pageEl.append(intro);

  const label = document.createElement("label");
  label.classList = "image-wrapper";
  label.setAttribute("for", `input-image-${index}-0`);

  const button = document.createElement("button");
  button.setAttribute("id", `input-image-${index}-0`);
  button.setAttribute("data-query", "slot-input-image");
  button.setAttribute("data-scrapbook", scrapbook.id);
  button.setAttribute("data-page", index);
  button.setAttribute("data-index", 0);
  button.classList = "input-image";
  configPopup(button);

  const imgEl = document.createElement("img");
  imgEl.classList = "image";

  const slot = page.slots[0];

  if (slot.state === "EMPTY") {
    imgEl.src = new URL(
      "../../assets/checklist-image-placeholder.svg",
      import.meta.url
    );
  } else {
    imgEl.setAttribute(
      "src",
      `http://localhost:8000/api/scrapbooks/${scrapbook.id}/pages/${index}/0/image`
    );
  }

  label.append(button);
  label.append(imgEl);
  pageEl.append(label);
};

export { buildColorPage };
