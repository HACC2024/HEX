/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaSave, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

interface NotepadProps {
  initialContent?: string;
  className?: string;
  onSave?: (content: string) => Promise<void>;
}

// Dynamic import of Jodit Editor
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

const NotepadEditor: React.FC<NotepadProps> = ({
  initialContent = '',
  className = '',
  onSave
}) => {
  const [content, setContent] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('notepad-content');
        return saved || initialContent;
    }
    return initialContent;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Editor configuration
  const editorConfig = {
    height: '500px',
    width: '100%',
    toolbar: true,
    spellcheck: true,
    toolbarButtonSize: 'middle' as const,
    toolbarSticky: false,
    theme: 'light',
    uploader: {
      insertImageAsBase64URI: true
    },
    enableDragAndDropFileToEditor: true,
    controls: {
      font: {
        list: {
          'Arial': 'Arial',
          'Times New Roman': 'Times New Roman',
          'Courier New': 'Courier New',
          'Georgia': 'Georgia',
        }
      }
    }
  };

  // Content update handler
  const handleUpdate = (newContent: string) => {
    setContent(newContent);
  };

  // Auto-save effect
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('notepad-content', content);
        // Optional: Show subtle save indicator
        const toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        toast.fire({
          icon: 'success',
          title: 'Auto-saved'
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(saveTimer);
  }, [content]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Save to provided handler if exists
      if (onSave) {
        await onSave(content);
      }
      
      // Always save to localStorage
      localStorage.setItem('notepad-content', content);
      
      await Swal.fire({
        icon: 'success',
        title: 'Saved successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed to save',
        text: 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  }, [content, onSave]);

  // Clear content functionality
  const handleClear = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    });

    if (result.isConfirmed) {
      setContent('');
      localStorage.removeItem('notepad-content');
      Swal.fire({
        title: 'Cleared!',
        text: 'Your notepad has been cleared.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const exportAsPDF = () => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Add content to iframe with styles
      const iframeDoc = iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Export PDF</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  margin: 20px;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                p { margin: 10px 0; }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        iframeDoc.close();
  
        // Print the iframe content
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
  
        // Clean up
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }
    } catch (error) {
      console.error('Export error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export failed',
        text: 'Please try again'
      });
    }
  };

  const exportAsWord = async () => {
    try {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office'><head><meta charset='utf-8'></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + content + footer;
      
      const source = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
      saveAs(source, 'document.doc');
      
      await Swal.fire({
        icon: 'success',
        title: 'Word document exported successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed to export Word document',
        text: 'Please try again'
      });
    }
  };

  const exportAsText = async () => {
    try {
      // Remove HTML tags but preserve line breaks
      const text = content
        .replace(/<br\s*\/?>/gi, '\n') // Replace <br> tags with newlines
        .replace(/<p.*?>/gi, '') // Remove opening <p> tags
        .replace(/<\/p>/gi, '\n') // Replace closing </p> tags with newlines
        .replace(/<div.*?>/gi, '') // Remove opening <div> tags
        .replace(/<\/div>/gi, '\n') // Replace closing </div> tags with newlines
        .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
        .replace(/\n\s*\n/g, '\n\n') // Normalize multiple blank lines to two
        .trim(); // Remove leading/trailing whitespace
  
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'document.txt');
      
      await Swal.fire({
        icon: 'success',
        title: 'Text file exported successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Text Export error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed to export text file',
        text: 'Please try again'
      });
    }
  };

  // Export options modal
  const ExportModal = () => (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Export Your InstaNote</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowExportOptions(false)}
            />
          </div>
          <div className="modal-body">
            <div className="d-grid gap-2">
              <span className="text-muted">Pro Tip: PDF export is recommended</span>
              <button 
                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  setShowExportOptions(false);
                  exportAsPDF();
                }}
              >
                <FaFilePdf /> Export as PDF
              </button>
              <button 
                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  setShowExportOptions(false);
                  exportAsWord();
                }}
              >
                <FaFileWord /> Export as Word
              </button>
              <button 
                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  setShowExportOptions(false);
                  exportAsText();
                }}
              >
                <FaFileAlt /> Export as Text
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowExportOptions(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`card ${className}`}>
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
          <h5 className="mb-0">InstaNote - Interactive Reports</h5>
          <div className="btn-group">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              <FaSave />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="btn btn-secondary d-flex align-items-center gap-2"
              onClick={() => setShowExportOptions(true)}
            >
              Export
            </button>
            <button
              className="btn btn-danger d-flex align-items-center gap-2"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <JoditEditor
            value={content}
            config={editorConfig}
            onBlur={handleUpdate}
          />
        </div>
      </div>

      {showExportOptions && <ExportModal />}
    </>
  );
};

export default NotepadEditor;