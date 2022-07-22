import { uploadImage, uploadText } from "../endpoints/slots.endpoint";

const initListeners = (element) => {
  const textarea = element.querySelector(
    '[data-query="text-image-tpl-textarea"]'
  );

  const inputFile = element.querySelector('[data-query="text-image-tpl-file"]');

  textarea.addEventListener("change", updateTextSlot);
  inputFile.addEventListener("change", updateImageSlot);
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
  console.log(page);
  pageEl.innerHTML = `
  <div class="summary">
    El viaje de ${scrapbook.who} a ${scrapbook.where}
    <img src="${new URL(
      "../../assets/pin.svg",
      import.meta.url
    )}" class="image" alt="" />
  </div>
  <div class="text-image-tpl-wrapper">
    <div class="text-image-tpl-text">
      <p class="font-ligature intro">
      ¡Qué ilusión! Nos vamos a
        <span class="where">${scrapbook.where}<span>
      </p>
      <textarea data-query="text-image-tpl-textarea" class="text-image-tpl-textarea" aria-label="texto sobre el viaje" data-scrapbook="${
        scrapbook.id
      }" data-page="${pageIndex}" data-index="1">
        ${page.slots[1].text ? page.slots[1].text : ""}
      </textarea>
    </div>
    <div class="text-image-tpl-image">
      <img src="${new URL(
        "../../assets/quokka-map.svg",
        import.meta.url
      )}" class="text-image-tpl-quokka" alt="" />
      <div class="image-decoration">
        <label class="text-image-tpl-image-wrapper" for="text-image-tpl-file">
          <img src="${new URL(
            "../../assets/media_background.svg",
            import.meta.url
          )}" class="image" alt="" />
          <input type="file" class="text-image-tpl-file" id="text-image-tpl-file" data-query="text-image-tpl-file" data-scrapbook="${
            scrapbook.id
          }" data-page="${pageIndex}" data-index="0">
          <img src="http://localhost:8000/api/scrapbooks/${
            scrapbook.id
          }/pages/${pageIndex}/0/image" class="text-image-tpl-image-user" data-query="text-image-tpl-image-user" alt="" />
        </label>
      </div>
  </div>
    `;
  initListeners(pageEl);
};

export { buildTextImagePage };
