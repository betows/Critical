import { PDFDocument } from "pdf-lib";

export default (_, inject) => {
  inject("pdfLib", { PDFDocument });
};
