const initPrintListener = () => {
  const printBtn = document.querySelector('[data-query="print-btn"]');
  printBtn.addEventListener("click", () => {
    print();
  });
};

const init = () => {
  initPrintListener();
};

init();
