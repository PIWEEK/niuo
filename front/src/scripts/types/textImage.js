
const buildTextImagePage = (pageEl, page, index, scrapbook) => {
  pageEl.innerHTML = `
  <div class="summary">El viaje de ${scrapbook.who} a ${scrapbook.where}</div>
  <p class="font-ligature intro">
  ¡Qué ilusión! TEXTO CON IMAGEN
  </p>
    `;
};

export { buildTextImagePage };
