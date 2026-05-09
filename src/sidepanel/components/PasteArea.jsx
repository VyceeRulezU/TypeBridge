import React, { useState, useRef } from 'react';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import styles from './PasteArea.module.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PasteArea({ onPaste, initialText = '' }) {
  const [text, setText] = React.useState(initialText);
  
  React.useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if (text.trim()) onPaste(text);
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
        const result = await mammoth.extractRawText({ arrayBuffer });
        console.log('TypeBridge: Docx extracted length:', result.value?.length);
        setText(result.value);
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

      <div className={styles.dropZone}>
        <textarea
          className={styles.textarea}
          placeholder="Paste structured document here or drag & drop a PDF/DOCX file"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isLoading}
        />
        {text.trim() && !isLoading && (
          <button className={styles.clearBtn} onClick={() => setText('')}>Clear</button>
        )}
        {isLoading && <div className={styles.loadingOverlay}>Extracting text...</div>}
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
