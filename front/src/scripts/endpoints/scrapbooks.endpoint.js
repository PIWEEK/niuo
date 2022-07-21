import { config } from "../../assets/config";
import { pageMock } from "../mocks/pages.mock";

// # Scrapbook data model

// id (UUID): Autogenerado
// name (string): Nombre del cuaderno
// when (string) fecha
// where (string)
// who (strin): nombre del niño
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

  console.log(">>>", url);
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
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

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });

  return res.json();
};

const deleteScrapbook = async (id) => {
  const url = `${config.apiUrl}/scrapbooks/${id}`;

  await fetch(url, {
    method: "DELETE",
    ...options,
  });
  return;
};

const duplicateScrapbook = async (id) => {
  const url = `${config.apiUrl}/scrapbooks/${id}/duplicate`;

  await fetch(url, {
    method: "POST",
    ...options,
  });
  return;
};

export {
  listScrapbooks,
  createScrapbook,
  getScrapbook,
  modifyScrapbook,
  deleteScrapbook,
  duplicateScrapbook,
};
