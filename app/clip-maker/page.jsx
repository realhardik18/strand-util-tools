'use client'
import { useState } from 'react';
import Image from 'next/image';

export default function Clips() {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (e, imageNumber) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Store the complete data URL instead of just the base64 part
                if (imageNumber === 1) setImage1(e.target.result);
                else setImage2(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateVideo = async () => {
        if (!image1 || !image2) {
            alert('Please upload both images');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://strand-utils-backend-zgdz.onrender.com/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_1: image2,  // Now sending complete data URL
                    image_2: image1   // Now sending complete data URL
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error:', response.status, errorData);
                throw new Error(`Server returned ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            setPreviewUrl(data.url);
        } catch (error) {
            console.error('Error creating video:', error);
            alert(`Failed to create video: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Add download handler function
    const handleDownloadVideo = async () => {
        if (!previewUrl) return;
        
        try {
            // Fetch the video file
            const response = await fetch(previewUrl);
            const blob = await response.blob();
            
            // Create a URL for the blob
            const blobUrl = URL.createObjectURL(blob);
            
            // Create a temporary link element to trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            
            // Set the filename for download
            downloadLink.download = `clip-${new Date().getTime()}.mp4`;
            
            // Append to document, click and remove
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up by revoking the blob URL
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download the video');
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="container mx-auto">
                <h1 className="text-black text-4xl font-bold text-center mb-8">Clip Maker</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side - Controls */}
                    <div className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <div className="bg-gray-100 rounded-lg p-6">
                                <label className="block text-black mb-2">Image 1</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 1)}
                                    className="block w-full text-sm text-gray-600
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-black file:text-white
                                    hover:file:bg-gray-800"
                                />
                                {image1 && (
                                    <div className="mt-2">
                                        <img src={image1} alt="Preview 1" className="max-h-40 rounded" />
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-100 rounded-lg p-6">
                                <label className="block text-black mb-2">Image 2</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 2)}
                                    className="block w-full text-sm text-gray-600
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-black file:text-white
                                    hover:file:bg-gray-800"
                                />
                                {image2 && (
                                    <div className="mt-2">
                                        <img src={image2} alt="Preview 2" className="max-h-40 rounded" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateVideo}
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Create Video
                        </button>
                    </div>

                    {/* Right Side - Preview */}
                    <div className="bg-gray-100 rounded-lg p-6">
                        <h2 className="text-black text-2xl mb-4">Preview</h2>
                        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                            {isLoading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                                    <p className="mt-4 text-gray-600">Creating your video...</p>
                                </div>
                            ) : previewUrl ? (
                                <video controls className="w-full h-full rounded-lg">
                                    <source src={previewUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p className="text-gray-600">Video preview will appear here</p>
                            )}
                        </div>
                        {previewUrl && !isLoading && (
                            <button 
                                onClick={handleDownloadVideo}
                                className="mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                                Download Video
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}