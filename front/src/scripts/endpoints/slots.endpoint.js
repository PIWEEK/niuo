import { config } from "../../assets/config";

// # Slot data model

// Imagen: Cuando se recupere dará un base64 con la imagen
// Texto: Texto plano?
// JSON: Tipo genérico para guardar información estructurada

const options = {
  mode: "cors",
  credentials: "include",
};

const uploadImage = async (scrapbookId, pageId, slotId, image) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}/${slotId}/image`;

  const formData = new FormData();
  formData.append("file", image);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: formData,
    ...options,
  });

  return res.json();
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
