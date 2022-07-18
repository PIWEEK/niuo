import { config } from "../../assets/config";

// # Slot data model

// Imagen: Cuando se recupere dará un base64 con la imagen
// Texto: Texto plano?
// JSON: Tipo genérico para guardar información estructurada

const uploadImage = (scrapbookId, pageId, slotId, image) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}/${slotId}/image`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(image),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const uploadText = (scrapbookId, pageId, slotId, text) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}/${slotId}/text`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(text),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

const uploadData = (scrapbookId, pageId, slotId, data) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}/${slotId}/data`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(texdatat),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

export { uploadImage, uploadText, uploadData };
