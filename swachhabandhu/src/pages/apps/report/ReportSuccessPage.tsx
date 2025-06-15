import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ReportSuccessPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 transform transition-all hover:scale-105">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for helping improve your community. Your report has been sent to the municipality for review.
        </p>
        <div className="space-y-3">
          {reportId && (
            <Link 
                to={`/reports/${reportId}`} 
                className="w-full inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:-translate-y-1"
            >
              View My Report
            </Link>
          )}
          <Link 
              to="/" 
              className="w-full inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportSuccessPage;