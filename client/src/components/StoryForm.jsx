import React, { useState, useEffect } from 'react';
import PhotoUploader from './PhotoUploader';
import { uploadPhotos, generateStorybook } from '../services/api';

const LOADING_MESSAGES = [
  { text: "Starting your magical storybook..." },
  { text: "Crafting personalised story pages..." },
  { text: "Adding dreamy colours and effects..." },
  { text: "Almost there — final magic touches..." },
];

const LoadingScreen = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [elapsed, setElapsed]   = useState(0);

  useEffect(() => {
    const m = setInterval(() => setMsgIndex(p => Math.min(p+1, LOADING_MESSAGES.length-1)), 20000);
    const t = setInterval(() => setElapsed(p => p+1), 1000);
    return () => { clearInterval(m); clearInterval(t); };
  }, []);

  const fmt = s => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;

  return (
    <div className="card text-center py-16 px-8">
      <div className="text-6xl font-bold text-purple-400 mb-6">✦</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Creating Your Magical Storybook</h2>
      <p className="text-lg text-purple-600 font-semibold mb-6">{LOADING_MESSAGES[msgIndex].text}</p>
      <div className="flex justify-center gap-2 mb-6">
        {LOADING_MESSAGES.map((_,i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i<=msgIndex?"bg-purple-500":"bg-gray-200"}`}/>
        ))}
      </div>
      <div className="w-64 h-2 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-1000"
          style={{ width:`${Math.min(((msgIndex+1)/LOADING_MESSAGES.length)*100,95)}%` }}
        />
      </div>
      <p className="text-sm text-gray-400 mb-4">Time elapsed: {fmt(elapsed)}</p>
      <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-2xl max-w-sm mx-auto">
        <p className="text-sm text-purple-700 leading-relaxed">
          Your storybook is being created with love. Your PDF will be ready and emailed to you shortly — please don't close this page!
        </p>
      </div>
    </div>
  );
};

const StoryForm = ({ onSuccess }) => {
  const [babyName,    setBabyName]    = useState('');
  const [parentName,  setParentName]  = useState('');
  const [email,       setEmail]       = useState('');
  const [storyType,   setStoryType]   = useState('bedtime');
  const [photos,      setPhotos]      = useState([]);
  const [sessionId,   setSessionId]   = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating,setIsGenerating]= useState(false);
  const [error,       setError]       = useState('');

  const handlePhotosSelected = async (files) => {
    setError('');
    setIsUploading(true);
    try {
      const res = await uploadPhotos(files);
      setPhotos(res.photos);
      setSessionId(res.sessionId);
    } catch (err) {
      setError(err.message || 'Failed to upload photos');
      setPhotos([]);
      setSessionId(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!babyName.trim())              { setError("Please enter your baby's name"); return; }
    if (!email.trim())                 { setError("Please enter your email address"); return; }
    if (!email.includes('@'))          { setError("Please enter a valid email address"); return; }
    if (!sessionId || photos.length<6) { setError('Please upload at least 6 photos'); return; }

    setIsGenerating(true);
    try {
      const res = await generateStorybook({
        babyName:   babyName.trim(),
        parentName: parentName.trim(),
        email:      email.trim(),
        sessionId,
        storyType,
      });
      onSuccess(res);
    } catch (err) {
      setError(err.message || 'Failed to generate storybook');
      setIsGenerating(false);
    }
  };

  if (isGenerating) return <LoadingScreen />;

  const canSubmit = !isUploading && photos.length >= 6 && babyName.trim() && email.trim();

  return (
    <div className="card">
      <div className="text-center mb-10">
        <div className="text-5xl font-bold text-purple-400 mb-4">✦</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Storybook</h1>
        <p className="text-gray-600 mb-4">Fill in the details below and upload your favourite photos</p>
        {/* Pricing badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg">
          <span>Only ₹199</span>
          <span className="opacity-60">|</span>
          <span>$2.99</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Baby Name */}
        <div>
          <label htmlFor="babyName" className="block text-sm font-semibold text-gray-700 mb-2">
            Baby's Name <span className="text-pink-500">*</span>
          </label>
          <input type="text" id="babyName" value={babyName}
            onChange={e => setBabyName(e.target.value)}
            placeholder="Enter your baby's name"
            className="input-field" maxLength={50}
          />
        </div>

        {/* Parent Name */}
        <div>
          <label htmlFor="parentName" className="block text-sm font-semibold text-gray-700 mb-2">
            Parent Name(s) <span className="text-gray-400">(optional)</span>
          </label>
          <input type="text" id="parentName" value={parentName}
            onChange={e => setParentName(e.target.value)}
            placeholder="e.g. Mommy & Daddy"
            className="input-field" maxLength={100}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Email <span className="text-pink-500">*</span>
          </label>
          <input type="email" id="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="We'll email your storybook here"
            className="input-field"
          />
          <p className="text-xs text-gray-400 mt-1">
            Your storybook PDF will be emailed to you instantly after generation.
          </p>
        </div>

        {/* Story Type */}
        <div>
          <label htmlFor="storyType" className="block text-sm font-semibold text-gray-700 mb-2">
            Story Type
          </label>
          <select id="storyType" value={storyType}
            onChange={e => setStoryType(e.target.value)}
            className="input-field cursor-pointer">
            <option value="bedtime">Bedtime Routine</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">More story types coming soon!</p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Photos <span className="text-pink-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Upload 6-10 photos of your baby — they'll appear on every page of the storybook.
          </p>
          <PhotoUploader
            onPhotosSelected={handlePhotosSelected}
            photos={photos}
            isUploading={isUploading}
          />
        </div>

        {/* What you get */}
        {photos.length >= 6 && (
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
            <p className="text-sm font-semibold text-purple-800 mb-2">What you get:</p>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>+ 8-page personalised PDF storybook</li>
              <li>+ Your baby's real photos on every page</li>
              <li>+ Unique magical theme per page</li>
              <li>+ Emailed to you instantly</li>
              <li>+ Print at home or at any print shop</li>
            </ul>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-center text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isUploading ? 'Uploading Photos...' : 'Generate My Storybook'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Secure checkout powered by DreamLoom
        </p>
      </form>
    </div>
  );
};

export default StoryForm;