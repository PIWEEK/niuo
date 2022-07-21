const buildEmotionsPage = (pageEl, page, index, scrapbook) => {
  pageEl.innerHTML = `
  <div class="summary">El viaje de ${scrapbook.who} a ${scrapbook.where}</div>
  <p class="font-ligature fs-2 intro">
  ¿Cómo te lo has pasado en tu viaje a ${
    scrapbook.where
  }?<br>Elije la emoción y dibujale el cuerpo
  </p>
  <div class="emotions">
    <img class="emotion" src="${new URL(
      "../../assets/emotion-1.svg",
      import.meta.url
    )}" alt="">
    <img class="emotion" src="${new URL(
      "../../assets/emotion-2.svg",
      import.meta.url
    )}" alt="">
    <img class="emotion" src="${new URL(
      "../../assets/emotion-3.svg",
      import.meta.url
    )}" alt="">
    <img class="emotion" src="${new URL(
      "../../assets/emotion-4.svg",
      import.meta.url
    )}" alt="">
    <img class="emotion" src="${new URL(
      "../../assets/emotion-5.svg",
      import.meta.url
    )}" alt="">
  </div>
    `;
};

export { buildEmotionsPage };
