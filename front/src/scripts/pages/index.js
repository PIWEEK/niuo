import { listScrapbooks, createScrapbook, duplicateScrapbook, deleteScrapbook } from "../endpoints/scrapbooks.endpoint";

const buildCard = (sb) => {
  const composerUrl = `/composer.html?id=${sb.id}`;
  
  return `
  <div class="actions">
    <button class="ac-share"></button>
    <button class="ac-duplicate"></button>
    <button class="ac-delete"></button>
  </div>
  <a href="${composerUrl}">
     <div class="scrapbook-cover">
       <div class="tpl-cover">
         <p class="font-ligature fs-4">Mi viaje a</p>
         <p class="font-ligature fs-7">${sb.where}</p>
         <p class="font-ligature fs-4">por</p>
         <p class="font-ligature fs-7">${sb.who}</p>
       </div>
     </div>
     <ul class="cards-info" data-query="scrapbook-data">
       <li><strong>Viaje a:</strong> <span data-query="scrapbook-data-destination"> ${sb.where} </span></li>
       <li><strong>Fecha:</strong> ${sb.when} </li>
       <li><strong>Viajan:</strong> <span data-query="scrapbook-data-child"> ${sb.who} </span></li>
     </ul>
   </a>`;
}

const addScrapbookToList = (sb) => {
  const scrapbooksList = document.getElementById("scrapbooks-list");
  const li = document.createElement("li");
  li.classList = "scrapbook";
  li.innerHTML = buildCard(sb);

  li.querySelector(".ac-share").addEventListener("click", () => {
    location.href = `/composer.html?id=${sb.id}`;
  });
  
  li.querySelector(".ac-duplicate").addEventListener("click", async () => {
    await duplicateScrapbook(sb.id);
    loadScrapbooks();
  });
  
  li.querySelector(".ac-delete").addEventListener("click", async () => {
    await deleteScrapbook(sb.id);
    loadScrapbooks();
  });
  
  scrapbooksList.append(li);
};

const initHandlers = () => {
  const elems = document.querySelectorAll("[data-action='new-scrapbook']");

  for (const elem of elems) {
    elem.addEventListener("click", handleNewScrapbook);
  }
};

const loadScrapbooks = async () => {
  document.getElementById("scrapbooks-list").innerHTML = "";

  const scrapbooks = await listScrapbooks();

  if (scrapbooks.length === 0) {
    console.log(document.querySelector(".index-placeholder"))
    document.querySelector(".index-placeholder").style.display = "block";
  }

  for (sb of scrapbooks) {
    addScrapbookToList(sb);
  }
}


const handleNewScrapbook = async (event) => {
  event.preventDefault();
  const sb = await createScrapbook({
    name: "Mi viaje",
    who: "Alguien",
    where: "En algún sitio",
    when: "En algún momento",
  });

  location.href = `/composer.html?id=${sb.id}`;
}

initHandlers();
loadScrapbooks();
