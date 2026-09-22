import React, { useState } from 'react';

const UploadForm = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !url || !name) {
      setError('Please fill in all fields (including at least one image)');
      return;
    }

    setUploading(true);
    setError('');

    const API_URL = `http://${window.location.hostname}:8000/api/photos/`;

    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('photo_name', name);
        formData.append('photo_path', file);
        formData.append('photo_url', url);
        formData.append('category', category);

        return fetch(API_URL, {
          method: 'POST',
          body: formData,
        }).then(async (response) => {
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(`Failed to upload ${file.name}: ` + JSON.stringify(errData));
          }
          return response;
        });
      });

      await Promise.all(uploadPromises);

      setFiles([]);
      setUrl('');
      setName('');
      setCategory('general');
      onUploadSuccess();
    } catch (err) {
      setError('Error uploading: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-12 p-8 border border-gray-800 bg-[#111] rounded-2xl shadow-xl mt-12 text-white">
      <h2 className="text-2xl font-bold mb-6">Upload New Photo</h2>
      {error && <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-400">Photo Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2.5 border border-gray-700 bg-[#222] text-white rounded-lg focus:outline-none focus:border-white transition-colors" 
            placeholder="e.g., Mountain View"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-400">Media File(s)</label>
          <input 
            type="file" 
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))} 
            className="w-full p-2.5 border border-gray-700 bg-[#222] text-white rounded-lg focus:outline-none focus:border-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200" 
          />
          {files.length > 0 && <div className="text-xs text-gray-500 mt-2">{files.length} file(s) selected</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-400">Associated URL</label>
          <input 
            type="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            className="w-full p-2.5 border border-gray-700 bg-[#222] text-white rounded-lg focus:outline-none focus:border-white transition-colors" 
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-400">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full p-2.5 border border-gray-700 bg-[#222] text-white rounded-lg focus:outline-none focus:border-white transition-colors appearance-none"
          >
            <option value="general">General</option>
            <option value="santhal">Santhal</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={uploading}
          className="bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors mt-2"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
