import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadClothing } from '../services/api';
import type { UploadFormProps } from '../types';

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError('Please upload a JPEG or PNG image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const newItem = await uploadClothing(file);
      onSuccess(newItem);

      // Clear preview after successful upload
      setTimeout(() => {
        setPreview(null);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload clothing');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        className={`
          relative border border-dashed rounded p-16 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInput}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-5">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded"
            />
            {uploading && (
              <div className="text-sm text-gray-500 tracking-wide font-light">
                Analyzing your clothing...
              </div>
            )}
            {!uploading && (
              <div className="text-sm text-green-700 font-light tracking-wide">
                Successfully added to wardrobe
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-lg font-light tracking-wide text-gray-900">Upload a clothing item</div>
              <div className="text-sm text-gray-400 mt-2 tracking-wide">
                Drag & drop or click to select
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3 tracking-wider">
              JPEG, PNG up to 5MB
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 border-red-100 text-red-700 text-sm tracking-wide">
          {error}
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-gray-50 border-gray-100">
        <h3 className="font-light mb-4 tracking-wide text-gray-900">How it works</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside tracking-wide leading-relaxed">
          <li>Take a clear photo of a clothing item</li>
          <li>Upload it here (we'll analyze it with AI)</li>
          <li>We'll categorize it and add it to your wardrobe</li>
          <li>Get personalized outfit recommendations</li>
        </ol>
      </div>
    </div>
  );
}
