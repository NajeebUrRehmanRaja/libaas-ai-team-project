'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Download, RefreshCw, Sparkles, X } from 'lucide-react';

type StyleOption = {
  id: string;
  name: string;
  description: string;
};

const styleOptions: StyleOption[] = [
  { id: 'Wedding / Shadi', name: 'Wedding / Shadi', description: 'Wedding / Shadi style'},
  { id: 'Mehndi', name: 'Mehndi', description: 'Mehndi attire'},
  { id: 'Cultural', name: 'Cultural Event', description: 'Cultural ethnic wear'},
  { id: 'Office / Professional', name: 'Office / Professional', description: 'Office / Professional wear'},
  { id: 'Casual Outing', name: 'Casual Outing', description: 'Casual Outing attire'},
  { id: 'Party / Celebration', name: 'Party / Celebration', description: 'Party / Celebration attire'},
  { id: 'Formal Dinner', name: 'Formal Dinner', description: 'Formal Dinner attire'},
];

export default function DemoPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle) return;

    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
      // For demo purposes, we'll use the same image with a filter effect
      setGeneratedImage(uploadedImage);
      setIsGenerating(false);
    }, 3000);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setSelectedStyle('');
    setPrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-styled-outfit.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Try Our AI Style Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your photo and let AI transform your style. Experiment with different looks instantly!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Upload & Controls */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 text-green-600" />
                Upload Your Photo
              </h2>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-3 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
                  uploadedImage
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
                }`}
              >
                {uploadedImage ? (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <p className="text-center mt-4 text-green-600 font-semibold">
                      ✓ Photo uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Choose Your Style
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                      selectedStyle === style.id
                        ? 'border-green-600 bg-green-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{style.name}</div>
                    <div className="text-xs text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Prompt */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Additional Instructions (Optional)
              </h2>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Add a blue blazer', 'Make it more colorful', 'Business casual for summer'..."
                className="w-full h-24 p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || !selectedStyle || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                !uploadedImage || !selectedStyle || isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  Generate AI Style
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                AI Generated Result
              </h2>
              
              <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 min-h-[500px] flex items-center justify-center">
                {generatedImage ? (
                  <div className="relative w-full h-full">
                    <div className="relative w-full h-[500px]">
                      <Image
                        src={generatedImage}
                        alt="Generated"
                        fill
                        className="object-contain"
                      />
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        ✨ AI Generated
                      </div>
                    </div>
                    
                    {/* Download Button */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : isGenerating ? (
                  <div className="text-center p-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 border-8 border-green-200 rounded-full"></div>
                      <div className="absolute inset-0 border-8 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                      AI is working its magic...
                    </p>
                    <p className="text-gray-500">
                      This may take a few seconds
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-600 mb-2">
                      No result yet
                    </p>
                    <p className="text-gray-500">
                      Upload a photo and select a style to get started
                    </p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Regenerate with Same Style
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

