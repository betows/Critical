import jsPDF from "jspdf";

export default (_, inject) => {
  inject("jsPDF", jsPDF);
};
