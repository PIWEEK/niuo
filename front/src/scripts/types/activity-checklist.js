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
    console.log("forEach");
    imageSlot.addEventListener("change", updateImageSlot);
  });
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
  console.log(event.currentTarget);
  const input = event.currentTarget;
  const scrapbook = input.getAttribute("data-scrapbook");
  const page = input.getAttribute("data-page");
  const index = input.getAttribute("data-index");
  await uploadImage(scrapbook, page, index, event.target.files[0]);

  input.parentElement.querySelector("img").src =
    `http://localhost:8000/api/scrapbooks/${scrapbook}/pages/${page}/${index}/image`
};

const buildActivityPage = (element, page, pageIndex, scrapbook) => {
  const checklistEl = `
  <div class="summary">El viaje de ${scrapbook.who} a Sevilla</div>
  <p class="font-ligature fs-2 intro">¡Hola ${scrapbook.who}! En tu viaje a ${scrapbook.where} estás viendo cosas muy chulas. Encuentra estas
  y rodéalas con un círculo:</p>
  `;
  element.innerHTML = checklistEl;

  const gridWrapper = document.createElement("div");
  const gridStart = document.createElement("div");
  const gridEnd = document.createElement("div");
  gridStart.classList.add("grid-start");
  gridEnd.classList.add("grid-end");
  gridWrapper.classList.add("checklist");

  page.slots.forEach((slot, index) => {
    let slotEl;
    if (slot.type === "image") {
      // Create wrapper
      slotEl = document.createElement("label");
      slotEl.setAttribute("for", `checklist-input-image-${index}`);
      slotEl.classList.add("checklist-image-wrapper");
      // Create Input
      inputEl = document.createElement("input");
      inputEl.setAttribute("type", "file");
      inputEl.setAttribute("id", `checklist-input-image-${index}`);
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
        imgEl.setAttribute("src", "");
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
      slotEl.setAttribute("data-query", "checklist-slot-input-text");
      slotEl.setAttribute("data-scrapbook", scrapbook.id);
      slotEl.setAttribute("data-page", pageIndex);
      slotEl.setAttribute("data-index", index);
      slotEl.value = slot.text;
    }
    if (index <= 6) {
      gridStart.append(slotEl);
    }
    if (index === 6) {
      slotEl === null;
    }
    if (index >= 6 && index <= 12) {
      gridEnd.insertBefore(slotEl, gridEnd.firstChild);
    }
  });

  gridWrapper.append(gridStart);
  gridWrapper.append(gridEnd);
  element.append(gridWrapper);

  initInputListeners(element);
};

export { buildActivityPage };
