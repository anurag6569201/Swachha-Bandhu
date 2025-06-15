import React, { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react';
import { useFormContext, type SubmitHandler } from 'react-hook-form';
import type { IssueCategory } from '../../../../types/index';
import { getIssueCategories } from '../services/reportService';

type FormInputs = {
  issue_category: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
};

interface Props {
  onBack: () => void;
  onSubmit: SubmitHandler<FormInputs>;
  isSubmitting: boolean;
  apiError: string | null;
  files: FileList | null;
  onFilesChange: (files: FileList | null) => void;
  municipalityId: string;
}

const CreateReportStep: React.FC<Props> = ({ onBack, onSubmit, isSubmitting, apiError, files, onFilesChange, municipalityId }) => {
  const { register, handleSubmit, formState: { errors } } = useFormContext<FormInputs>();
  const [previews, setPreviews] = useState<string[]>([]);
  const [issueCategories, setIssueCategories] = useState<IssueCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!municipalityId) return;
      setIsLoadingCategories(true);
      setCategoryError(null);
      try {
        const categories = await getIssueCategories(municipalityId);
        setIssueCategories(categories);
      } catch (error) {
        console.error("Failed to fetch issue categories", error);
        setCategoryError("Could not load issue categories. Please go back and try again.");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [municipalityId]);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }
    const objectUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => { objectUrls.forEach(url => URL.revokeObjectURL(url)); };
  }, [files]);
  
  const removeFile = useCallback((indexToRemove: number) => {
    if (!files) return;
    const dataTransfer = new DataTransfer();
    Array.from(files).filter((_, i) => i !== indexToRemove).forEach(file => dataTransfer.items.add(file));
    onFilesChange(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  }, [files, onFilesChange]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    onFilesChange(newFiles && newFiles.length > 0 ? newFiles : null);
  };

  return (
    <div className="flex flex-col animate-fade-in">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Step 3: Describe the Issue</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="issue_category" className="block text-sm font-medium text-gray-700">Issue Category</label>
              <select 
                id="issue_category" 
                {...register('issue_category', { required: 'Please select a category' })} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                disabled={isLoadingCategories || !!categoryError}
              >
                <option value="">
                  {isLoadingCategories ? 'Loading categories...' : categoryError ? 'Error loading categories' : 'Select a category...'}
                </option>
                {/* --- DEFENSIVE CHECK ADDED HERE --- */}
                {/* This prevents the app from crashing if issueCategories is not an array */}
                {Array.isArray(issueCategories) && issueCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.issue_category && <p className="mt-1 text-sm text-red-600">{errors.issue_category.message}</p>}
              {categoryError && <p className="mt-1 text-sm text-red-600">{categoryError}</p>}
            </div>
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity</label>
              <select id="severity" {...register('severity', { required: 'Please select a severity' })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="HIGH">High</option>
              </select>
              {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" rows={4} {...register('description', { required: 'Description is required', minLength: { value: 10, message: "Please provide a description of at least 10 characters."} })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Photos/Videos (Optional)</label>
              <input type="file" multiple accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} key={files?.length || 0} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 w-full text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-400 rounded-md py-4 px-4 flex justify-center items-center cursor-pointer">Click to select files</button>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {previews.map((src, index) => (
                  <div key={src} className="relative group">
                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                    <button type="button" onClick={() => removeFile(index)} className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            )}
            {apiError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{apiError}</div>}
            <div className="flex justify-between items-center pt-4">
                 <button type="button" onClick={onBack} disabled={isSubmitting} className="text-gray-600 hover:text-gray-800 disabled:text-gray-400">Back</button>
                 <button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded disabled:bg-green-300 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                 </button>
            </div>
        </form>
    </div>
  );
};

export default CreateReportStep;