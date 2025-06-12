// src/pages/app/report/SubmitReportPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapPin, Image as ImageIcon, MessageSquare, Send, Loader2 } from 'lucide-react';

import type { Location } from '../../../types';
import { getLocationById } from '../../../services/api/locationService';
import { submitReport } from '../../../services/api/reportService';
import Button from '../../../components/ui/Button';

// A component for the file preview
const FilePreview: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => (
  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-300">
    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
    <button onClick={onRemove} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 text-xs">×</button>
  </div>
);


const SubmitReportPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();

  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch location details and user's geo-location on mount
  useEffect(() => {
    document.title = 'Submit Report - Swachh Bandhu';
    if (!locationId) {
      toast.error("No location ID provided.");
      navigate('/app/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch location and get user geo-location in parallel
        const locationPromise = getLocationById(locationId);
        const geoPromise = new Promise<{ lat: number; lon: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
            (err) => reject(new Error(err.message))
          );
        });

        const [locationResponse, coords] = await Promise.all([locationPromise, geoPromise]);
        
        setLocation(locationResponse.data);
        setUserCoords(coords);
      } catch (err: any) {
        console.error("Failed to load data:", err);
        const errorMessage = err.message.includes("geolocation") ? "Could not get your location. Please enable location services." : "Failed to load location data.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locationId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Limit to 5 files
      const newFiles = Array.from(e.target.files).slice(0, 5 - mediaFiles.length);
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userCoords || !locationId || !issueType) {
        toast.error("Missing required information. Please fill out the issue type.");
        return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('location', locationId);
    formData.append('issue_type', issueType);
    formData.append('description', description);
    formData.append('user_latitude', userCoords.lat.toString());
    formData.append('user_longitude', userCoords.lon.toString());
    
    mediaFiles.forEach(file => {
      formData.append('media_files', file);
    });

    try {
        await submitReport(formData);
        toast.success("Report submitted successfully! Thank you for your contribution.");
        navigate('/app/dashboard');
    } catch (err: any) {
        toast.error(err.response?.data?.detail || "Failed to submit report. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading report form...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <motion.div 
        className="container mx-auto max-w-2xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-6 border-b pb-4">
            <p className="text-sm text-gray-500">You are reporting an issue at:</p>
            <h1 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
              <MapPin /> {location?.name}
            </h1>
            <p className="text-gray-600">{location?.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="issueType" className="block text-lg font-semibold text-gray-800 mb-2">
                What is the issue?
              </label>
              <input
                id="issueType"
                type="text"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                placeholder="e.g., Broken Bench, Overflowing Bin"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <MessageSquare /> Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details about the issue..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <ImageIcon /> Add Photos/Videos (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <div className="mt-4 flex flex-wrap gap-4">
                {mediaFiles.map((file, index) => (
                  <FilePreview key={index} file={file} onRemove={() => removeFile(index)} />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="full"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitReportPage;