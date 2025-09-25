import toast from 'react-hot-toast';

export const notification = {
	success: (message: string) => toast.success(message),
	error: (message: string) => toast.error(message),
	warn: (message: string) => toast(message),
};
