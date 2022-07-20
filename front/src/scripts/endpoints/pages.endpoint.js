import { config } from "../../assets/config";

// # Page data model

// id (UUID): autogenerado. Este ID identifica la página independientemente de su orden
// order (Integer): cuanto menor sea irá por delante en el cuaderno. Idealmente deberían cubrirse todos los números pero tampoco pasa nada si no porque se accede por ID
// type (Enumerado): representa el tipo de página
// slots (Array de Slot)

const options = {
  mode: "cors",
  credentials: "include",
};

const createPage = async (scrapbookId, data) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages`;

  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options
  });

  return await res.json();
};

const modifyPage = async (scrapbookId, pageId, data) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const deletePage = (scrapbookId, pageId) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}`;

  fetch(url, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

export { createPage, modifyPage, deletePage };
