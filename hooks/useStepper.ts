import { useState, useCallback } from "react";

export function useStepper<T extends string | number>(steps: readonly T[]) {
    // steps are fixed — we only track current index
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalSteps = steps.length;
    const currentStep = steps[currentIndex];

    const nextStep = useCallback(() => {
        setCurrentIndex((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
    }, [totalSteps]);

    const prevStep = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, []);

    const goToStep = useCallback(
        (index: number) => {
            if (index >= 0 && index < totalSteps) setCurrentIndex(index);
            else if (index === totalSteps) setCurrentIndex(totalSteps - 1);
            else setCurrentIndex(0);
        },
        [totalSteps],
    );

    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === totalSteps - 1;

    return {
        currentStep,
        currentIndex,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        isFirstStep,
        isLastStep,
    };
}
