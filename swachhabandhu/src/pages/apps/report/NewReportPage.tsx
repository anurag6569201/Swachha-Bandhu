// src/pages/apps/report/NewReportPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form';
import ScanQRCodeStep from './steps/1_ScanQRCodeStep';
import ProvideCoordsStep from './steps/2_ProvideCoordsStep';
import CreateReportStep from './steps/3_CreateReportStep';
import { createReport, verifyReport, type UserCoordinates } from './services/reportService'; // Updated service
import type { LocationDetails } from './services/locationService';
import Stepper from './components/Stepper';
import type { ReportDetail } from '../../../types';
import apiClient from '../../../Api';

type ReportFormInputs = {
  issue_category: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
};

interface Props {
  mode?: 'new' | 'verify';
}

const NewReportPage: React.FC<Props> = ({ mode = 'new' }) => {
  const navigate = useNavigate();
  // For new reports, it's a locationId. For verifications, it's the originalReportId.
  const { locationId: urlLocationId, originalReportId } = useParams<{ locationId: string, originalReportId: string }>();

  // Determine the primary ID based on the mode
  const entityId = mode === 'verify' ? originalReportId : urlLocationId;

  const [currentStep, setCurrentStep] = useState(entityId ? 'PROVIDE_COORDS' : 'SCAN_QR');
  const [locationId, setLocationId] = useState<string | null>(null);
  const [originalReport, setOriginalReport] = useState<ReportDetail | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  
  const formMethods = useForm<ReportFormInputs>({ defaultValues: { severity: 'MEDIUM' } });

  // If in verify mode, fetch the original report to get its locationId
  useEffect(() => {
    if (mode === 'verify' && originalReportId) {
        const fetchOriginalReport = async () => {
            try {
                const report = await apiClient.get<ReportDetail>(`/reports/${originalReportId}/`);
                setOriginalReport(report.data);
                setLocationId(report.data.location); // Set locationId from the fetched report
            } catch (error) {
                setApiError("Could not load the report you are trying to verify.");
                setCurrentStep('SCAN_QR'); // Revert to a safe step
            }
        };
        fetchOriginalReport();
    } else if (mode === 'new' && urlLocationId) {
        setLocationId(urlLocationId);
    }
  }, [mode, originalReportId, urlLocationId]);

  const handleQRCodeScanned = (scannedData: string) => {
    try {
        const url = new URL(scannedData);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const id = pathParts[pathParts.length - 1];
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        
        if (uuidRegex.test(id)) {
          setLocationId(id);
          setCurrentStep('PROVIDE_COORDS');
          navigate(`/app/report/new/${id}`, { replace: true });
        } else {
          setApiError("Invalid QR Code. Please scan a valid location code.");
        }
    } catch(e) {
        setApiError("Invalid QR code format.");
    }
  };

  const handleCoordsAndDetailsProvided = (coords: UserCoordinates, details: LocationDetails) => {
    setUserCoords(coords);
    setLocationDetails(details);
    setCurrentStep('CREATE_REPORT');
    // For verification, pre-fill form with original report's data
    if (mode === 'verify' && originalReport) {
        formMethods.reset({
            issue_category: originalReport.issue_category.id,
            severity: originalReport.severity,
            description: `Verification for Report #${originalReport.id}: ${originalReport.description}`
        });
    }
  };

  const handleFormSubmit: SubmitHandler<ReportFormInputs> = async (data) => {
    if (!locationId || !userCoords) {
        setApiError("Critical data missing. Please start over.");
        return;
    }
    
    const formData = new FormData();
    formData.append('location', locationId);
    formData.append('issue_category', data.issue_category);
    formData.append('description', data.description);
    formData.append('severity', data.severity);
    formData.append('user_latitude', userCoords.latitude.toFixed(6));
    formData.append('user_longitude', userCoords.longitude.toFixed(6));

    if (mediaFiles) {
      Array.from(mediaFiles).forEach(file => formData.append('media_files', file));
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      let newReport;
      if (mode === 'verify' && originalReportId) {
        newReport = await verifyReport(originalReportId, formData);
      } else {
        newReport = await createReport(formData);
      }
      navigate(`/app/report/success/${newReport.id}`);
    } catch (error: any) {
      const errorData = error.response?.data;
      const messages = errorData ? Object.entries(errorData).map(([key, value]) => `${key}: ${value}`).join('; ') : 'An unknown error occurred.';
      setApiError(messages);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    setApiError(null);
    if (currentStep === 'CREATE_REPORT') {
      setCurrentStep('PROVIDE_COORDS');
    } else if (currentStep === 'PROVIDE_COORDS') {
      const backUrl = mode === 'verify' ? '/app/verify' : '/app/report/new';
      navigate(backUrl, { replace: true });
      setCurrentStep('SCAN_QR'); // Reset to initial state
      setLocationId(null);
    }
  };

  const renderStep = () => {
    // Show a loading indicator while fetching original report details in verify mode
    if (mode === 'verify' && !originalReport) {
        return <div className="text-center p-6">Loading original report data...</div>;
    }

    switch (currentStep) {
      case 'SCAN_QR':
        return <ScanQRCodeStep onScanSuccess={handleQRCodeScanned} />;
      case 'PROVIDE_COORDS':
        if (!locationId) return null;
        return <ProvideCoordsStep locationId={locationId} onCoordsAndDetailsProvided={handleCoordsAndDetailsProvided} onBack={handleBack} />;
      case 'CREATE_REPORT':
        if (!locationId || !userCoords || !locationDetails) return null;
        return (
          <FormProvider {...formMethods} >
            <CreateReportStep 
              onBack={handleBack} 
              onSubmit={handleFormSubmit} 
              isSubmitting={isSubmitting} 
              apiError={apiError} 
              files={mediaFiles} 
              onFilesChange={setMediaFiles} 
              municipalityId={locationDetails.municipality}
            />
          </FormProvider>
        );
      default: return null;
    }
  };
  
  const currentStepIndex = currentStep === 'SCAN_QR' ? 0 : currentStep === 'PROVIDE_COORDS' ? 1 : 2;
  const pageTitle = mode === 'verify' ? "Verify an Existing Issue" : "Report a New Issue";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">{pageTitle}</h1>
        <Stepper steps={['Scan QR', 'Confirm Location', 'Submit Verification']} currentStep={currentStepIndex}/>
        <div className="mt-12">
            {apiError && currentStep === 'SCAN_QR' && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center" role="alert">
                    {apiError}
                </div>
            )}
            {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default NewReportPage;