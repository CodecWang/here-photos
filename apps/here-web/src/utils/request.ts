import { toast } from 'sonner';

export const request = async <T>(url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.message);

    const jsonResponse = await response.json();
    return jsonResponse.data as T;
  } catch (error) {
    // TODO(arthur): handle error globally
    toast('Request failed', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
    });
    console.error('Request error:', error);
    return null;
    // eventBus.emit('request.error', (error as Error).message);
  }
};
