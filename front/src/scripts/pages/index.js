import { listScrapbooks, createScrapbook } from "../endpoints/scrapbooks.endpoint";

const addScrapbookToList = (sb) => {
  const scrapbooksList = document.getElementById("scrapbooks-list");
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = sb["name"];
  a.href = `/composer.html?id=${sb.id}`;
  li.append(a);
  scrapbooksList.append(li);
};

const loadScrapbooks = async () => {
  console.log("loadScrapbooks");

  const newScrapbookBtn = document.getElementById("newScrapbookBtn");
  newScrapbookBtn.addEventListener("click", handleNewScrapbook);

  const scrapbooks = await listScrapbooks();

  for (sb of scrapbooks) {
    addScrapbookToList(sb);
  }
}

const handleNewScrapbook = async (event) => {
  console.log(event);
  
  const sb = await createScrapbook({
    name: "Mi viaje",
    place: "Desconocido"
  });

  location.href = `/composer.html?id=${sb.id}`;
}


loadScrapbooks();
