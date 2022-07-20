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
const options = {
  mode: "cors",
  credentials: "include",
};

const listScrapbooks = async () => {
  const url = `${config.apiUrl}/scrapbooks`;

  const res = await fetch(url, options);
  return await res.json();
};

const createScrapbook = async (data) => {
  const url = `${config.apiUrl}/scrapbooks`;

  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options
  });

  return res.json();
};

const getScrapbook = async (id) => {
  const url = `${config.apiUrl}/scrapbooks/${id}`;

  const res = await fetch(url, options);
  return res.json();
};

const modifyScrapbook = async (id, data) => {
  const url = `${config.apiUrl}/scrapbooks/${id}`;

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const deleteScrapbook = (id) => {
  const url = `${config.apiUrl}/scrapbooks/${id}`;

  fetch(url, {
    method: "DELETE",
    ...options
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
