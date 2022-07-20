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
    body: formData,
    ...options,
  });

  return res.json();
};

const uploadText = async (scrapbookId, pageId, slotId, text) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}/${slotId}/text`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(text),
    ...options,
  });

  return await res.json();
};

const uploadData = (scrapbookId, pageId, slotId, data) => {
  const url = `${config.apiUrl}/scrapbooks/${scrapbookId}/pages/${pageId}/${slotId}/data`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};

export { uploadImage, uploadText, uploadData };
