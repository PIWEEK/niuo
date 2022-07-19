import { rand, randWord, randImg } from "@ngneat/falso";

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

const pageMock = [
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
];

export { pageMock };
