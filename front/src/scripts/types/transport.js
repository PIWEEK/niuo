const buildTransportPage = (pageEl, page, index, scrapbook) => {
  pageEl.innerHTML = `
    <div class="summary">
      El viaje de ${scrapbook.who} a ${scrapbook.where}
      <img src="${new URL(
        "../../assets/pin.svg",
        import.meta.url
      )}" class="image" alt="" />
    </div>
    <p class="font-ligature fs-2 intro">
    ¿En qué medios de transporte has montado en tu viaje?<br>Rodéalos y si quieres puedes colorearlos también.
    </p>
    <div class="transport-list">
        <img class="transport t-plane" src="${new URL(
          "../../assets/transport-plane.svg",
          import.meta.url
        )}" alt="">
        <div class="t-name">avión</div>
        <img class="transport t-boat" src="${new URL(
          "../../assets/transport-boat.svg",
          import.meta.url
        )}" alt="">
        <div class="t-name">barco</div>
        <img class="transport t-scooter" src="${new URL(
          "../../assets/transport-scooter.svg",
          import.meta.url
        )}" alt="">
        <div class="t-name">patinete</div>
        <img class="transport t-train" src="${new URL(
          "../../assets/transport-train.svg",
          import.meta.url
        )}" alt="">
        <div class="t-name">tren</div>
        <img class="transport t-bus" src="${new URL(
          "../../assets/transport-bus.svg",
          import.meta.url
        )}" alt="">
        <div class="t-name">autobus</div>
        <img class="transport t-car" src="${new URL(
          "../../assets/transport-car.svg",
          import.meta.url
        )}" alt="">
        <div class="t-name">coche</div>
    </div>
    <img class="bg-ilu ilu-quokka-flag" src="${new URL(
      "../../assets/quokka_flag.svg",
      import.meta.url
    )}" alt="">
      `;
};

export { buildTransportPage };
