import {
  exists,
  remove,
  BaseDirectory,
  writeFile,
} from '@tauri-apps/plugin-fs';
import { openPath } from '@tauri-apps/plugin-opener';
import { downloadDir, sep } from '@tauri-apps/api/path';
import html2pdf from 'html2pdf.js';

export const genererPdf = async (
  fileName: string,
  html: string,
): Promise<void> => {
  if ('__TAURI_INTERNALS__' in window) {
    genererPdfTauri(fileName, html);
  } else {
    genererPdfWeb(fileName, html);
  }
};

const genererPdfWeb = (fileName: string, html: string): void => {
  const pW = window.open(
    '',
    '',
    `width=${screen.availWidth},height=${screen.availHeight}`,
  );
  if (pW === null) {
    throw new Error("Impossible d'ouvrir la fenêtre d'impression.");
  }

  pW.document.write(html);
  pW.document.title = fileName;
  pW.onafterprint = () => {
    pW.close();
  };
  pW.print();
};

const genererPdfTauri = async (
  fileName: string,
  html: string,
): Promise<void> => {
  const fileExists = await exists(fileName, {
    baseDir: BaseDirectory.Download,
  });
  if (fileExists) {
    await remove(fileName, { baseDir: BaseDirectory.Download });
  }

  const worker = html2pdf()
    .from(html)
    .set({
      margin: 10,
      filename: fileName,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  const pdf = await worker.outputPdf('arraybuffer');

  await writeFile(fileName, pdf, { baseDir: BaseDirectory.Download });

  const downloads = await downloadDir();
  const filePath = `${downloads}${sep()}${fileName}`;

  await openPath(filePath);
};
