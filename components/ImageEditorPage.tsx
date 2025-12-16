import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useTheme } from '../context/ThemeContext';
import { IMAGES } from '../constants';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai"; // Import Gemini API

interface ImageEditorPageProps {
  onBackToHub: () => void;
}

// Utility function to convert Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const ImageEditorPage: React.FC<ImageEditorPageProps> = ({ onBackToHub }) => {
  const { config, updateImage, resetImages } = useConfig();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});

  // Image Generation States
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: keyof typeof IMAGES) => {
    if (editValues[key] !== undefined) {
      updateImage(key, editValues[key]);
      // Clear edit value after save to show it's synced or keep it? 
      // Keeping it is fine, but maybe show visual feedback.
    }
  };

  const handleGenerateImage = async () => {
    if (!generationPrompt.trim()) {
      setGenerationError('Please enter a prompt to generate an image.');
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setGenerationError(null);

    try {
      // Ensure API_KEY is available in the environment
      if (!process.env.API_KEY) {
        throw new Error("API Key is not configured. Please ensure process.env.API_KEY is set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview', // Using high-quality image generation model
        contents: {
          parts: [
            { text: generationPrompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1", // Default to square for versatility
            imageSize: "1K" // Default to 1K resolution
          },
        },
      });

      let base64EncodeString: string | undefined;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64EncodeString = part.inlineData.data;
          break;
        }
      }

      if (base64EncodeString) {
        setGeneratedImageUrl(`data:image/png;base64,${base64EncodeString}`);
      } else {
        setGenerationError('No image data found in the response.');
      }
    } catch (error: any) {
      console.error('Image generation failed:', error);
      setGenerationError(`Generation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyGeneratedImageUrl = () => {
    if (generatedImageUrl) {
      const base64Data = generatedImageUrl.split(',')[1];
      navigator.clipboard.writeText(base64Data)
        .then(() => alert('Image URL (Base64) copied to clipboard!'))
        .catch(err => console.error('Failed to copy image URL:', err));
    }
  };

  const imageKeys = Object.keys(config.images) as (keyof typeof IMAGES)[];
  const filteredKeys = imageKeys.filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`min-h-screen p-8 transition-colors ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold brand-font uppercase tracking-widest text-yellow-500">
                <i className="fas fa-tools mr-3"></i> Backend Image Editor
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Update system assets and backgrounds globally.
            </p>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={resetImages}
                className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors text-xs font-bold uppercase tracking-widest"
            >
                Reset All Defaults
            </button>
            <button 
                onClick={onBackToHub}
                className={`px-6 py-2 rounded font-bold uppercase tracking-widest text-xs transition-colors
                            ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-white hover:bg-zinc-200 text-black shadow'}`}
            >
                <i className="fas fa-arrow-left mr-2"></i> Back to Hub
            </button>
        </div>
      </div>

      {/* AI Image Generation Section */}
      <div className={`max-w-7xl mx-auto p-6 rounded-lg border flex flex-col space-y-4 shadow-lg mb-8
                       ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h2 className="text-xl font-bold brand-font uppercase tracking-widest text-blue-500 flex items-center">
          <i className="fas fa-magic mr-3"></i> AI Image Generation
        </h2>
        <div className="flex-1">
          <label className={`block text-[10px] uppercase font-bold mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Image Generation Prompt
          </label>
          <textarea
            value={generationPrompt}
            onChange={(e) => setGenerationPrompt(e.target.value)}
            className={`w-full p-2 text-xs font-mono rounded border resize-y h-24 focus:outline-none focus:border-blue-500
                        ${isDarkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-300 text-zinc-800'}`}
            placeholder="Describe the image you want to generate (e.g., 'A vintage airplane flying over a sunset, realistic')"
          />
        </div>
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating || !generationPrompt.trim()}
          className={`px-6 py-3 rounded font-bold uppercase tracking-wider transition-all
                      ${isGenerating || !generationPrompt.trim()
                        ? 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Generating...
            </span>
          ) : (
            'Generate Image'
          )}
        </button>

        {generationError && (
          <div className="text-red-500 text-sm mt-4 p-3 border border-red-700 bg-red-900/20 rounded">
            <i className="fas fa-exclamation-circle mr-2"></i> {generationError}
          </div>
        )}

        {generatedImageUrl && (
          <div className="mt-4 p-4 border border-zinc-700 rounded-lg bg-black/50">
            <h3 className={`text-sm uppercase font-bold mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Generated Image Preview
            </h3>
            <div className="w-full h-64 bg-zinc-800 rounded overflow-hidden flex items-center justify-center border border-zinc-600 mb-4">
              <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-contain" />
            </div>
            <button
              onClick={handleCopyGeneratedImageUrl}
              className={`w-full px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all
                          bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20`}
            >
              <i className="fas fa-copy mr-2"></i> Copy Image URL (Base64)
            </button>
            <p className={`text-[10px] text-zinc-500 mt-2 text-center`}>
              Paste this URL into any 'Image URL' field above to update an asset.
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto mb-8">
        <input 
            type="text" 
            placeholder="Search Image Keys..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-4 rounded-lg border font-mono text-sm focus:outline-none focus:border-yellow-500
                        ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKeys.map((key) => {
            const currentUrl = config.images[key];
            const editedUrl = editValues[key] !== undefined ? editValues[key] : currentUrl;
            const isChanged = editedUrl !== currentUrl;

            return (
                <div key={key} className={`p-4 rounded-lg border flex flex-col space-y-4 shadow-lg
                                         ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="flex justify-between items-center border-b pb-2 border-zinc-700/50">
                        <span className="font-mono text-xs font-bold text-yellow-500 truncate" title={key}>{key}</span>
                        {isChanged && <span className="text-[10px] bg-yellow-500 text-black px-1 rounded font-bold">MODIFIED</span>}
                    </div>
                    
                    {/* Preview */}
                    <div className="w-full h-32 bg-black/50 rounded overflow-hidden flex items-center justify-center border border-zinc-700">
                        <img src={editedUrl} alt={key} className="w-full h-full object-contain" />
                    </div>

                    {/* Input */}
                    <div className="flex-1">
                        <label className={`block text-[10px] uppercase font-bold mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Image URL</label>
                        <textarea
                            value={editedUrl}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full p-2 text-xs font-mono rounded border resize-none h-20 focus:outline-none focus:border-yellow-500
                                      ${isDarkMode ? 'bg-black border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-300 text-zinc-800'}`}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-2">
                         <button 
                            onClick={() => handleSave(key)}
                            disabled={!isChanged}
                            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all
                                      ${isChanged 
                                        ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-900/20' 
                                        : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed'}`}
                        >
                            Save Update
                        </button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};