import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form';
import ScanQRCodeStep from './steps/1_ScanQRCodeStep';
import ProvideCoordsStep from './steps/2_ProvideCoordsStep';
import CreateReportStep from './steps/3_CreateReportStep';
import { createReport, type UserCoordinates } from './services/reportService';
import type { LocationDetails } from './services/locationService';
import Stepper from './components/Stepper';

type ReportFormInputs = {
  issue_category: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
};

export type ReportStep = 'SCAN_QR' | 'PROVIDE_COORDS' | 'CREATE_REPORT';
const STEPS: ReportStep[] = ['SCAN_QR', 'PROVIDE_COORDS', 'CREATE_REPORT'];

const NewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { locationId: urlLocationId } = useParams<{ locationId: string }>();

  const [currentStep, setCurrentStep] = useState<ReportStep>(urlLocationId ? 'PROVIDE_COORDS' : 'SCAN_QR');
  const [locationId, setLocationId] = useState<string | null>(urlLocationId || null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  
  const formMethods = useForm<ReportFormInputs>({ defaultValues: { severity: 'MEDIUM' } });

  const handleQRCodeScanned = (scannedData: string) => {
    try {
        const url = new URL(scannedData);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const id = pathParts[pathParts.length - 1];
        
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        
        if (uuidRegex.test(id)) {
          setLocationId(id);
          setCurrentStep('PROVIDE_COORDS');
          navigate(`/report/new/${id}`, { replace: true });
        } else {
          setApiError("Invalid QR Code. Please scan a valid location code.");
        }
    } catch(e) {
        setApiError("Invalid QR code format. Please scan a valid location code.");
    }
  };

  const handleCoordsAndDetailsProvided = (coords: UserCoordinates, details: LocationDetails) => {
    setUserCoords(coords);
    setLocationDetails(details);
    setCurrentStep('CREATE_REPORT');
  };

  const handleFormSubmit: SubmitHandler<ReportFormInputs> = async (data) => {
    if (!locationId || !userCoords || !locationDetails) {
        setApiError("Critical data missing. Please start over.");
        return;
    }
    
    const formData = new FormData();
    formData.append('location', locationId);
    formData.append('issue_category', data.issue_category);
    formData.append('description', data.description);
    formData.append('severity', data.severity);
    formData.append('user_latitude', userCoords.latitude.toString());
    formData.append('user_longitude', userCoords.longitude.toString());

    if (mediaFiles) {
      Array.from(mediaFiles).forEach(file => formData.append('media_files', file));
    }

    setIsSubmitting(true);
    setApiError(null);
    try {
      const newReport = await createReport(formData);
      navigate(`/report/success/${newReport.id}`);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        const messages = Object.entries(errorData).map(([key, value]) => {
          const formattedKey = key.replace(/_/g, ' ');
          return `${formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1)}: ${Array.isArray(value) ? value.join(', ') : value}`;
        }).join('; ');
        setApiError(messages);
      } else {
        setApiError('An unknown error occurred while submitting the report.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    setApiError(null);
    if (currentStep === 'CREATE_REPORT') {
      setCurrentStep('PROVIDE_COORDS');
    } else if (currentStep === 'PROVIDE_COORDS') {
      setCurrentStep('SCAN_QR');
      setLocationId(null);
      setLocationDetails(null);
      navigate('/report/new', { replace: true });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'SCAN_QR':
        return <ScanQRCodeStep onScanSuccess={handleQRCodeScanned} onScanError={setApiError} />;
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
  
  const currentStepIndex = STEPS.indexOf(currentStep);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Report a New Issue</h1>
        <Stepper steps={['Scan QR', 'Confirm Location', 'Report Details']} currentStep={currentStepIndex}/>
        <div className="mt-12">
            {apiError && currentStep === 'SCAN_QR' && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
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