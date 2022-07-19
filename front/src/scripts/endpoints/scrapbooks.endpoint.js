import { config } from "../../assets/config";
import { pageMock } from "../mocks/pages.mock";

// # Scrapbook data model

// id (UUID): Autogenerado
// name (string): Nombre del cuaderno
// dateStart (string formato YYYY-MM-DD)
// dateFinish (string) formato YYYY-MM-DD)
// destination (string)
// people (Array de String): representa los que viajan, en principio el niño estará en 0, madre en 1 y padre en 2
// ej: [“Paula”, “Yara”, “Javier”]
// pages (Array de Pages): el array estará ordenado por el campo “order” de la página

const listScrapbooks = () => {
  const url = `${config.apiUrl}/scrapbooks`;

  fetch(url)
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const createScrapbook = (data) => {
  const url = `${config.apiUrl}/scrapbooks`;

  fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const getScrapbook = (id) => {
  // const url = `${config.apiUrl}/scrapbooks/${id}`;

  // fetch(url)
  //   .then((res) => res.json())
  //   .catch((error) => console.error("Error:", error))
  //   .then((response) => console.log("Success:", response));
  return pageMock;
};

const modifyScrapbook = (id, data) => {
  const url = `${config.apiUrl}/scrapbooks/${id}`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const deleteScrapbook = (id) => {
  const url = `${config.apiUrl}/scrapbooks/${id}`;

  fetch(url, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

export {
  listScrapbooks,
  createScrapbook,
  getScrapbook,
  modifyScrapbook,
  deleteScrapbook,
};
