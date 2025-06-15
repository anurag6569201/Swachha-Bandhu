import React from 'react';

interface Props {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<Props> = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-2 sm:px-8">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-300" />
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-blue-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div key={label} className="relative flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold transition-all duration-300 ${
                  isCompleted ? 'bg-blue-500 text-white' : isActive ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-gray-300 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <p className={`absolute top-10 text-center text-xs w-28 ${isActive ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;