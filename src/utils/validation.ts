export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateLicensePlate = (plate: string): boolean => {
    return plate.trim().length >= 3;
};

export const validatePhoneNumber = (phone: string): boolean => {
    // Albanian phone numbers: +355 followed by 9 digits, or just 10 digits starting with 06/07
    const phoneRegex = /^(\+355|0)?[67]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePersonalId = (id: string): boolean => {
    // Albanian personal ID: 10 characters (1 letter + 9 digits)
    const idRegex = /^[A-Z]\d{9}$/i;
    return idRegex.test(id.trim());
};
