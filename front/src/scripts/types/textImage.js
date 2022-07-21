
const buildTextImagePage = (pageEl, page, index, scrapbook) => {
  pageEl.innerHTML = `
  <div class="summary">El viaje de ${scrapbook.who} a ${scrapbook.where}</div>
  <p class="font-ligature intro">
  ¡Qué ilusión! Nos vamos a
    <span class="where">${scrapbook.where}<span>
  </p>
  <div class="image-decoration"></div>
  <img src="" class="image" />
    `;
};

export { buildTextImagePage };
