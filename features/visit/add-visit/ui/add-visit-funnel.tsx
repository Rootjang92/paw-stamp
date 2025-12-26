'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { BasicInfoStep } from './basic-info-step';
import { PhotoUploadStep } from './photo-upload-step';
import { MemoStep } from './memo-step';
import { AddVisitFormData, FunnelStep, FUNNEL_STEPS } from '../model/types';
import { cn } from '@/shared/lib/cn';
import { motion, AnimatePresence } from 'motion/react';

interface AddVisitFunnelProps {
  cityCode: string;
  cityName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddVisitFormData) => void;
}

export function AddVisitFunnel({
  cityCode,
  cityName,
  isOpen,
  onClose,
  onSubmit,
}: AddVisitFunnelProps) {
  const [currentStep, setCurrentStep] = useState<FunnelStep>('basic');
  const [formData, setFormData] = useState<AddVisitFormData>({
    cityCode,
    cityName,
    visitDate: new Date().toISOString().split('T')[0],
    rating: null,
    photos: [],
    memo: '',
  });

  const currentStepIndex = FUNNEL_STEPS.findIndex((step) => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === FUNNEL_STEPS.length - 1;

  // 다음 단계로 이동 가능 여부
  const canProceed = () => {
    if (currentStep === 'basic') {
      return formData.rating !== null;
    }
    return true;
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      const nextStep = FUNNEL_STEPS[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      const prevStep = FUNNEL_STEPS[currentStepIndex - 1];
      setCurrentStep(prevStep.id);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleSkip = () => {
    if (currentStep === 'photos') {
      setFormData({ ...formData, photos: [] });
    } else if (currentStep === 'memo') {
      setFormData({ ...formData, memo: '' });
    }
    handleNext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative z-10 w-full max-w-lg bg-white shadow-xl dark:bg-zinc-900 rounded-t-2xl md:rounded-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                방문 기록 추가
              </h2>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                {FUNNEL_STEPS[currentStepIndex].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4 flex gap-2">
            {FUNNEL_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  index <= currentStepIndex
                    ? 'bg-primary-600'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 'basic' && (
                <BasicInfoStep
                  cityName={cityName}
                  visitDate={formData.visitDate}
                  rating={formData.rating}
                  onVisitDateChange={(date) =>
                    setFormData({ ...formData, visitDate: date })
                  }
                  onRatingChange={(rating) =>
                    setFormData({ ...formData, rating })
                  }
                />
              )}
              {currentStep === 'photos' && (
                <PhotoUploadStep
                  photos={formData.photos}
                  onPhotosChange={(photos) =>
                    setFormData({ ...formData, photos })
                  }
                />
              )}
              {currentStep === 'memo' && (
                <MemoStep
                  memo={formData.memo}
                  onMemoChange={(memo) => setFormData({ ...formData, memo })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex w-full gap-3">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrev} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
            )}

            {(currentStep === 'photos' || currentStep === 'memo') && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex-1"
              >
                건너뛰기
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn('gap-2', isFirstStep ? 'w-full' : 'flex-1')}
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  완료
                </>
              ) : (
                <>
                  다음
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
