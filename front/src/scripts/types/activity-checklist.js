const buildActivityPage = (element, page, scrapbook) => {
  console.log("buildActivityPage()", element, page, scrapbook);

  const checklistEl = `
  <div class="summary">El viaje de ${scrapbook.who} a Sevilla</div>
  <p class="font-ligature fs-2 intro">¡Hola ${scrapbook.who}! En tu viaje a ${scrapbook.where} estás viendo cosas muy chulas. Encuentra estas
  y rodéalas con un círculo:</p>
  `;
  element.innerHTML = checklistEl;
};

{
  /* <div class="body-content tpl-activity-checklist">
    <div class="summary">El viaje de Pau a Sevilla</div>

    <p class="font-ligature fs-2 intro">¡Hola Pau! En tu viaje a Sevilla estás viendo cosas muy chulas. Encuentra estas
        y rodéalas con un círculo:</p>

    <ul class="checklist">
        <li>
            <div class="image"></div>
            <p class="text">La Giralda</p>
        </li>
        <li>
            <div class="image"></div>
            <p class="text">La Torre del Oro</p>
        </li>
        <li>
            <div class="image"></div>
            <p class="text">Serranito</p>
        </li>
        <li>
            <div class="image"></div>
            <p class="text">La Giralda</p>
        </li>
        <li>
            <div class="image"></div>
            <p class="text">La Torre del Oro</p>
        </li>
        <li>
            <div class="image"></div>
            <p class="text">Serranito</p>
        </li>
    </ul>
</div> */
}

export { buildActivityPage };
