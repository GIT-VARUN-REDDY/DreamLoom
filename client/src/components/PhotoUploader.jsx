import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// ✅ Always use the deployed backend URL — never localhost
const BACKEND_URL = 'https://dreamloom-i2oa.onrender.com';

const PhotoUploader = ({ onPhotosSelected, photos, isUploading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onPhotosSelected(acceptedFiles);
    }
  }, [onPhotosSelected]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    minSize: 0,
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    disabled: isUploading,
  });

  const hasMinPhotos = photos.length >= 6;
  const hasMaxPhotos = photos.length >= 10;

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-lavender-500 bg-lavender-50'
            : 'border-lavender-200 hover:border-lavender-400 hover:bg-lavender-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${hasMaxPhotos ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="text-5xl mb-4">
          {isDragActive ? '📥' : '📷'}
        </div>

        {isDragActive ? (
          <p className="text-lavender-600 font-semibold">Drop your photos here!</p>
        ) : (
          <>
            <p className="text-gray-700 font-semibold mb-2">
              Drag & drop photos here, or click to select
            </p>
            <p className="text-gray-500 text-sm">
              JPEG, PNG, or WebP • Max 10MB each • 6-10 photos required
            </p>
          </>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-6 w-6 border-2 border-lavender-500 border-t-transparent rounded-full"></div>
              <span className="text-lavender-600 font-semibold">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="p-3 bg-blush-50 border border-blush-200 rounded-xl text-sm text-blush-600">
          Some files were rejected. Please use JPEG, PNG, or WebP images under 10MB.
        </div>
      )}

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Uploaded Photos ({photos.length}/10)
            </span>
            {hasMinPhotos && (
              <span className="text-sm text-mint-600 font-semibold flex items-center gap-1">
                <span>✓</span> Minimum reached
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {photos.map((photo, index) => (
              <div
                key={photo.filename}
                className="relative aspect-square rounded-xl overflow-hidden bg-lavender-100 shadow-soft"
              >
                {/* ✅ Use BACKEND_URL constant instead of hardcoded localhost */}
                <img
                  src={`${BACKEND_URL}${photo.path}`}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-lavender-600">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Photo count indicator */}
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < photos.length
                    ? i < 6
                      ? 'bg-lavender-400'
                      : 'bg-mint-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            {photos.length < 6
              ? `Upload ${6 - photos.length} more photo${6 - photos.length > 1 ? 's' : ''} to continue`
              : photos.length < 10
              ? `You can add ${10 - photos.length} more photos`
              : 'Maximum photos reached'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;