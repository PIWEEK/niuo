import {
  rand,
  randWord,
  randImg,
  randUuid,
  randSoonDate,
  randFutureDate,
  randCountry,
  randFullName,
  randNumber,
} from "@ngneat/falso";

const generateImgSlot = () => {
  const image = ["empty", randImg()];
  return {
    type: "image",
    status: rand(image),
  };
};

const generateTxtSlot = () => {
  return {
    type: "text",
    text: randWord(),
  };
};

const pageMock = {
  id: randUuid(),
  name: randWord(),
  dateStart: randSoonDate(),
  dateFinish: randFutureDate(),
  destination: randCountry(),
  child: randFullName(),
  pages: [
    {
      type: "cover",
    },
    {
      type: "activity_checklist",
      slots: [
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
      ],
    },
    {
      type: "activity_checklist",
      slots: [
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
      ],
    },
    {
      type: "activity_checklist",
      slots: [
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
      ],
    },
    {
      type: "activity_checklist",
      slots: [
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
        generateImgSlot(),
        generateTxtSlot(),
      ],
    },
  ],
};

export { pageMock };
