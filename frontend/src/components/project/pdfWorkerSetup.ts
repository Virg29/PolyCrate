import { pdfjs } from 'react-pdf';

// Initialize worker only once when needed
if (typeof window !== 'undefined') {
	pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';
}
