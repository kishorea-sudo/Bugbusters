import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, ExternalLink, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Version, ImportSource } from '../../types';

interface FileUploadProps {
  deliverableId: string;
  onUpload: (file: File, metadata: any) => void;
  onImport: (source: ImportSource) => void;
  currentVersion?: Version;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onImport,
  currentVersion,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importSource, setImportSource] = useState<'drive' | 'dropbox' | 'url'>('url');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const metadata = {
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      };

      onUpload(file, metadata);
      toast.success('File uploaded successfully!');
      
      // Simulate rule engine triggering review process
      setTimeout(() => {
        toast.success('Review process initiated. Client has been notified.');
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const handleImport = () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    const source: ImportSource = {
      type: importSource,
      url: importUrl,
      metadata: {
        importedAt: new Date(),
        source: importSource,
      },
    };

    onImport(source);
    setImportUrl('');
    setShowImportOptions(false);
    toast.success('File import initiated');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Version Display */}
      {currentVersion && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-medium text-gray-900 mb-3">Current Version</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentVersion.fileName}</p>
                <p className="text-sm text-gray-500">
                  v{currentVersion.version} • {formatFileSize(currentVersion.fileSize)} • 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    currentVersion.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : currentVersion.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentVersion.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentVersion.status === 'pending' && (
                <div className="flex items-center text-yellow-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">Awaiting approval</span>
                </div>
              )}
              <a
                href={currentVersion.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive || isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-600">Uploading file...</p>
            <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your file here or click to browse
              </p>
              <p className="text-gray-500">
                Supports all file types, max 100MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Import Options */}
      <div className="text-center">
        <button
          onClick={() => setShowImportOptions(!showImportOptions)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Or import from Drive/Dropbox
        </button>
      </div>

      {showImportOptions && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="drive"
                checked={importSource === 'drive'}
                onChange={(e) => setImportSource(e.target.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Google Drive</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="dropbox"
                checked={importSource === 'dropbox'}
                onChange={(e) => setImportSource(e.target.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Dropbox</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="url"
                checked={importSource === 'url'}
                onChange={(e) => setImportSource(e.target.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Direct URL</span>
            </label>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder={
                importSource === 'drive' 
                  ? 'https://drive.google.com/file/d/...'
                  : importSource === 'dropbox'
                  ? 'https://dropbox.com/s/...'
                  : 'https://example.com/file.pdf'
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Import
            </button>
            <button
              onClick={() => setShowImportOptions(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;