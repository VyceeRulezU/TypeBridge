import React, { useState, useRef } from 'react';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { htmlToStructuredText, fetchGoogleDoc, isGoogleDocLink } from '../../parser/importers.js';
import styles from './PasteArea.module.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PasteArea({ onPaste, initialText = '' }) {
  const [text, setText] = React.useState(initialText);
  
  React.useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [docLink, setDocLink] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const importGoogleDoc = async (url) => {
    setIsLoading(true);
    setError('');
    try {
      return await fetchGoogleDoc(url);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    const imported = await importGoogleDoc(docLink);
    if (imported) {
      setText(imported);
      setDocLink('');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    // A Google Docs link pasted into the main box: import it, then parse
    if (isGoogleDocLink(text)) {
      const imported = await importGoogleDoc(text);
      if (imported) {
        setText(imported);
        onPaste(imported);
      }
      return;
    }
    onPaste(text);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = async (file) => {
    setIsLoading(true);
    console.log('TypeBridge: processFile started for:', file.name, 'type:', file.type);
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        // Convert via HTML so Word heading styles become sections
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setText(htmlToStructuredText(result.value));
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log('TypeBridge: PDF pages count:', pdf.numPages);
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          const cleanPageText = pageText.replace(/\s{2,}/g, '\n\n');
          fullText += cleanPageText + '\n\n';
        }
        console.log('TypeBridge: PDF extracted length:', fullText.trim().length);
        setText(fullText.trim());
      } else if (file.type.startsWith('text/')) {
        const content = await file.text();
        console.log('TypeBridge: Text file length:', content.length);
        setText(content);
      } else {
        console.warn('TypeBridge: Unsupported file type:', file.type);
        alert('Unsupported file type. Please upload DOCX, PDF, or TXT.');
      }
    } catch (error) {
      console.error('TypeBridge: Error reading file:', error);
      alert('Error extracting text from file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`${styles.root} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      <div className={styles.linkRow}>
        <input
          type="url"
          className={styles.linkInput}
          placeholder="Paste a Google Docs link"
          value={docLink}
          onChange={e => setDocLink(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && docLink.trim() && handleImport()}
          disabled={isLoading}
        />
        <button className={styles.importBtn} onClick={handleImport} disabled={!docLink.trim() || isLoading}>
          Import
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.dropZone}>
        <textarea
          className={styles.textarea}
          placeholder="Paste structured document here, drag & drop a PDF/DOCX file, or paste a Google Docs link"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isLoading}
        />
        {text.trim() && !isLoading && (
          <button className={styles.clearBtn} onClick={() => setText('')}>Clear</button>
        )}
        {isLoading && <div className={styles.loadingOverlay}>Importing document...</div>}
      </div>
      
      <div className={styles.actions}>
        <input 
          type="file" 
          accept=".docx,.pdf,text/plain" 
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <button 
          className={styles.uploadBtn} 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          Upload File
        </button>
        <button 
          className={styles.button} 
          onClick={handleSubmit} 
          disabled={!text.trim() || isLoading}
        >
          Parse Document
        </button>
      </div>
    </div>
  );
}
