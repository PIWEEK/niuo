
const buildColorPage = (pageEl, page, index, scrapbook) => {
  pageEl.innerHTML = `
  <div class="summary">El viaje de ${scrapbook.who} a Sevilla</div>
  <p class="font-ligature intro">
  ¡A colorear!
  </p>
    `;
};

export { buildColorPage };
