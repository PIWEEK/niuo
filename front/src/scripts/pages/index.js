import { listScrapbooks, createScrapbook } from "../endpoints/scrapbooks.endpoint";

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

  scrapbooksList.append(li);
};

const loadScrapbooks = async () => {
  const newScrapbookBtn = document.getElementById("newScrapbookBtn");
  newScrapbookBtn.addEventListener("click", handleNewScrapbook);

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
  
  const sb = await createScrapbook({
    name: "Mi viaje",
    who: "Alguien",
    where: "En algún sitio",
    when: "En algún momento",
  });

  location.href = `/composer.html?id=${sb.id}`;
}


loadScrapbooks();
