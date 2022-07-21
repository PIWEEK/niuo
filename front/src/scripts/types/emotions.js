
const buildEmotionsPage = (pageEl, page, index, scrapbook) => {

  pageEl.innerHTML = `
  <div class="summary">El viaje de ${scrapbook.who} a Sevilla</div>
  <p class="font-ligature fs-2 intro">
  ¿Cómo te lo has pasado en tu viaje a ${scrapbook.where}?<br>Elije la emoción y dibujale el cuerpo
  </p>
  <div class="emotions">
    <div class="emotion e-1"></div>
    <div class="emotion e-2"></div>
    <div class="emotion e-3"></div>
    <div class="emotion e-4"></div>
    <div class="emotion e-5"></div>
  </div>
    `;
};

export { buildEmotionsPage };
