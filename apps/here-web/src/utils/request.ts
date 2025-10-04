export const request = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);

    return await response.json();
  } catch (error) {
    // TODO(arthur): handle error globally
    console.error('Request error:', error);
    // eventBus.emit('request.error', (error as Error).message);
  }
};
