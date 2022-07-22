
const buildColorPage = (pageEl, page, index, scrapbook) => {
  pageEl.innerHTML = `
  <div class="summary">
    El viaje de ${scrapbook.who} a ${scrapbook.where}
    <img src="${new URL(
      "../../assets/pin.svg",
      import.meta.url
    )}" class="image" alt="" />
  </div>
  <p class="font-ligature intro">
  ¡A colorear!
  </p>
  <img class="bg-ilu ilu-quokka-penpot" src="${new URL(
    "../../assets/quokka-penpot.svg",
    import.meta.url
  )}" alt="">
    `;
};

export { buildColorPage };
