const buildTransportPage = (pageEl, page, index, scrapbook) => {

    pageEl.innerHTML = `
    <div class="summary">El viaje de ${scrapbook.who} a ${scrapbook.where}</div>
    <p class="font-ligature fs-2 intro">
    ¿En qué medios de transporte has montado en tu viaje?<br>Rodéalos y si quieres puedes colorearlos también.
    </p>
    <div class="transport-list">
        <div class="transport t-plane"></div>
        <div class="t-name">barco</div>
        <div class="transport t-boat"></div>
        <div class="t-name">avión</div>
        <div class="transport t-scooter"></div>
        <div class="t-name">patinete</div>
        <div class="transport t-train"></div>
        <div class="t-name">tren</div>
        <div class="transport t-bus"></div>
        <div class="t-name">autobus</div>
        <div class="transport t-car"></div>
        <div class="t-name">coche</div>
    </div>
      `;
  };
  
  export { buildTransportPage };
  