export const validateVideoGame = (formData: any): string[] => {
    const errors: string[] = [];

    if (!formData.title?.trim()) {
        errors.push('Title is required');
    }

    if (formData.rating < 0 || formData.rating > 10) {
        errors.push('Rating must be between 0 and 10');
    }

    if (formData.title?.length > 100) {
        errors.push('Title must be 100 characters or less');
    }

    return errors;
};