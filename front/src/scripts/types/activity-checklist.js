import { uploadImage, uploadText } from "../endpoints/slots.endpoint";

const initInputListeners = (element) => {
  const textSlots = element.querySelectorAll(
    '[data-query="checklist-slot-input-text"]'
  );

  const imageSlots = element.querySelectorAll(
    '[data-query="checklist-slot-input-image"]'
  );

  textSlots.forEach((textSlot) => {
    textSlot.addEventListener("change", updateTextSlot);
  });

  imageSlots.forEach((imageSlot) => {
    imageSlot.addEventListener("change", updateImageSlot);
  });
};

const updateTextSlot = async (event) => {
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
    "img"
  ).src = `http://localhost:8000/api/scrapbooks/${scrapbook}/pages/${page}/${index}/image`;
};

const buildActivityPage = (element, page, pageIndex, scrapbook) => {
  const checklistEl = `
  <div class="summary">El viaje de ${scrapbook.who} a Sevilla</div>
  <p class="font-ligature fs-2 intro">
  ¡Hola ${scrapbook.who}! En tu viaje a ${scrapbook.where} estás viendo cosas muy chulas. Encuentra estas
  y rodéalas con un círculo:</p>
  `;
  element.innerHTML = checklistEl;

  const grid = document.createElement("div");
  grid.classList.add("checklist");

  page.slots.forEach((slot, index) => {
    let slotEl;
    if (slot.type === "image") {
      // Create wrapper
      slotEl = document.createElement("label");
      slotEl.setAttribute("for", `checklist-input-image-${pageIndex}-${index}`);
      slotEl.classList.add("checklist-image-wrapper");
      // Create Input
      inputEl = document.createElement("input");
      inputEl.setAttribute("type", "file");
      inputEl.setAttribute("id", `checklist-input-image-${pageIndex}-${index}`);
      inputEl.setAttribute("data-query", "checklist-slot-input-image");
      inputEl.setAttribute("data-scrapbook", scrapbook.id);
      inputEl.setAttribute("data-page", pageIndex);
      inputEl.setAttribute("data-index", index);
      inputEl.classList.add("checklist-input-image");
      // Create Image
      imgEl = document.createElement("img");
      imgEl.classList.add("image");
      imgEl.setAttribute("alt", "");

      slotEl.append(inputEl);
      slotEl.append(imgEl);

      if (slot.state === "EMPTY") {
        imgEl.src = new URL(
          "../../assets/checklist-image-placeholder.svg",
          import.meta.url
        );
        // imgEl.setAttribute("src", "/checklist-image-placeholder.svg");
      } else {
        imgEl.setAttribute(
          "src",
          `http://localhost:8000/api/scrapbooks/${scrapbook.id}/pages/${pageIndex}/${index}/image`
        );
      }
    } else if (slot.type === "text") {
      slotEl = document.createElement("input");
      slotEl.classList.add("text");
      slotEl.setAttribute("type", "text");
      slotEl.setAttribute("placeholder", "Añadir cosa");
      slotEl.setAttribute("data-query", "checklist-slot-input-text");
      slotEl.setAttribute("data-scrapbook", scrapbook.id);
      slotEl.setAttribute("data-page", pageIndex);
      slotEl.setAttribute("data-index", index);
      if (!!slot.text) {
        slotEl.value = slot.text;
      }
    }
    grid.append(slotEl);
  });

  element.append(grid);

  initInputListeners(element);
};

export { buildActivityPage };
