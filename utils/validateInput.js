
export const validateInput = (value, setErrorsCallback) => {
  let isValid = true;
  let newErrors = {};

  if (!value.title.trim()) {
    isValid = false;
    newErrors.title = 'Title is required';
  }

  if (!value.description.trim()) {
    isValid = false;
    newErrors.description = 'Description is required';
  }

  
  if (!value.participantLimit) {
    isValid = false;
    newErrors.participantLimit = 'Participant limit is required';
  }

  setErrorsCallback(newErrors);
  return isValid;
};
