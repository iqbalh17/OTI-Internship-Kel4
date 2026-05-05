export const fetchApi = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      const newHeaders = { ...headers } as any;
      delete newHeaders['Content-Type'];
      config.headers = newHeaders;
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }

  return data;
};