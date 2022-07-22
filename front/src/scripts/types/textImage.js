import { configPopup } from "./common";
import { uploadImage, uploadText } from "../endpoints/slots.endpoint";

const initListeners = (element) => {
  const textarea = element.querySelector(
    '[data-query="text-image-tpl-textarea"]'
  );

  textarea.addEventListener("change", updateTextSlot);
};

const updateTextSlot = async (event) => {
  console.log(event);
  const scrapbook = event.currentTarget.getAttribute("data-scrapbook");
  const page = event.currentTarget.getAttribute("data-page");
  const index = event.currentTarget.getAttribute("data-index");
  const text = event.currentTarget.value;
  await uploadText(scrapbook, page, index, text);
};

const updateImageSlot = async (event) => {
  const input = event.currentTarget;
  const scrapbook = input.getAttribute("data-scrapbook");
  const page = input.getAttribute("data-page");
  const index = input.getAttribute("data-index");
  await uploadImage(scrapbook, page, index, event.target.files[0]);

  input.parentElement.querySelector(
    '[data-query="text-image-tpl-image-user"]'
  ).src = `http://localhost:8000/api/scrapbooks/${scrapbook}/pages/${page}/${index}/image`;
};

const buildTextImagePage = (pageEl, page, pageIndex, scrapbook) => {
  const summary = document.createElement("div");
  summary.classList = "summary";
  summary.textContent = `El viaje de ${scrapbook.who} a ${scrapbook.where}`;
  pageEl.append(summary);

  const pinImageEl = document.createElement("img");
  const pinImageSVG = new URL(
    "../../assets/pin.svg",
    import.meta.url
  );
  pinImageEl.src = pinImageSVG;
  summary.append(pinImageEl);

  const wrapper = document.createElement("div");
  wrapper.classList = "text-image-tpl-wrapper";
  pageEl.append(wrapper);

  const intro = document.createElement("div");
  intro.classList = "text-image-tpl-text";
  intro.innerHTML = `
    <p class="font-ligature intro">
      ¡Qué ilusión! Nos vamos a <span class="where">${scrapbook.where}<span>
    </p>
    <textarea data-query="text-image-tpl-textarea" class="text-image-tpl-textarea" aria-label="texto sobre el viaje" data-scrapbook="${scrapbook.id}" data-page="${pageIndex}" data-index="1" placeholder="Escribe aquí">${page.slots[1].text ? page.slots[1].text : ""}</textarea>
  `;
  wrapper.append(intro);

  const imageWrapper = document.createElement("div");
  imageWrapper.classList = "text-image-tpl-image";

  const quokkaSVG = new URL(
    "../../assets/quokka-map.svg",
    import.meta.url
  );

  const backgroundSVG = new URL(
    "../../assets/media_background.svg",
    import.meta.url
  );

  const quokkaEl = document.createElement("img");
  quokkaEl.classList = "text-image-tpl-quokka";
  quokkaEl.src = quokkaSVG;
  imageWrapper.append(quokkaEl);

  const imageDecEl = document.createElement("div");
  imageDecEl.classList = "image-decoration";
  imageWrapper.append(imageDecEl);

  const backgroundEl = document.createElement("img");
  backgroundEl.src = backgroundSVG;
  backgroundEl.classList = "image";
  imageDecEl.append(backgroundEl);

  const label = document.createElement("label");
  label.classList = "text-image-tpl-image-wrapper";
  label.setAttribute("for", `input-image-${pageIndex}-0`);
  imageDecEl.append(label)


  const button = document.createElement("button");
  button.setAttribute("id", `input-image-${pageIndex}-0`);
  button.setAttribute("data-query", "slot-input-image");
  button.setAttribute("data-scrapbook", scrapbook.id);
  button.setAttribute("data-page", pageIndex);
  button.setAttribute("data-index", 0);
  button.classList = "text-image-tpl-file";
  configPopup(button);

  const imgEl = document.createElement("img");
  imgEl.classList = "text-image-tpl-image-user slot-image";

  const slot = page.slots[0];

  if (slot.state === "EMPTY") {
    imgEl.src = new URL(
      "../../assets/checklist-image-placeholder.svg",
      import.meta.url
    );
  } else {
    imgEl.setAttribute(
      "src",
      `http://localhost:8000/api/scrapbooks/${scrapbook.id}/pages/${pageIndex}/0/image`
    );
  }

  label.append(button);
  label.append(imgEl);

  wrapper.append(imageWrapper);

  initListeners(pageEl);
};

export { buildTextImagePage };
