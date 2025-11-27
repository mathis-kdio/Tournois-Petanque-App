import {
  exists,
  remove,
  BaseDirectory,
  writeFile,
} from '@tauri-apps/plugin-fs';
import html2pdf from 'html2pdf.js';

export const genererPdf = async (newFileName: string, html: string) => {
  const fileExists = await exists(newFileName, {
    baseDir: BaseDirectory.Download,
  });
  if (fileExists) {
    await remove(newFileName, { baseDir: BaseDirectory.Download });
  }

  const worker = html2pdf()
    .from(html)
    .set({
      margin: 10,
      filename: newFileName,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  const pdf = await worker.outputPdf('arraybuffer');

  await writeFile(newFileName, pdf, {
    baseDir: BaseDirectory.Download,
  });
};
