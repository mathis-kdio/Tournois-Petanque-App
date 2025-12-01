import {
  exists,
  remove,
  BaseDirectory,
  writeFile,
} from '@tauri-apps/plugin-fs';
import { openPath } from '@tauri-apps/plugin-opener';
import { downloadDir, sep } from '@tauri-apps/api/path';
import html2pdf from 'html2pdf.js';

export const genererPdf = async (fileName: string, html: string) => {
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
