import { supabase } from './supabase';

export async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    'Content-Type': 'application/json',
  };
}

export async function makeAuthenticatedRequest(url: string, method: string = 'GET', body?: any) {
  const headers = await getAuthHeaders();
  
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return response.json();
}