import { chatSessionService } from '../services/chatSession/index.service';
import { toast } from 'react-toastify';

export const useSessionValidation = () => {
  const sessionID = localStorage.getItem('userSessionId');

  return async () => {
    if (!sessionID) {
      toast.warn('You are not authorized');
      return false;
    }

    try {
      const { response: isValid } = await chatSessionService.validateSession({
        sessionID,
      });
      return isValid;
    } catch {
      toast.error('Session validation failed');
      return false;
    }
  };
};
