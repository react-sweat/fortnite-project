import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_FORTNITE_API_BASE_URL || 'https://fortnite-api.com';
const API_KEY = import.meta.env.VITE_FORTNITE_API_KEY;

const cache = new Map();
const errorCache = new Map();

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFortniteApi<T>(
  endpoint: string,
  params?: Record<string, any> | null
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (params === null) {
      if (mountedRef.current) {
        setLoading(false);
        setData(null);
        setError(null);
      }
      return;
    }

    const cacheKey = params ? `${endpoint}:${JSON.stringify(params)}` : endpoint;

    if (cache.has(cacheKey)) {
      if (mountedRef.current) {
        setData(cache.get(cacheKey));
        setLoading(false);
        setError(null);
      }
      return;
    }

    if (errorCache.has(cacheKey)) {
      if (mountedRef.current) {
        setError(errorCache.get(cacheKey));
        setLoading(false);
        setData(null);
      }
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
        setData(null);
      }

      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          params,
          headers: API_KEY ? { Authorization: API_KEY } : {},
          signal: controller.signal,
        });

        const result = response.data.data ?? response.data;
        
        if (mountedRef.current) {
          setData(result);
          setError(null);
        }
        
        cache.set(cacheKey, result);
        setTimeout(() => cache.delete(cacheKey), 120000);
        errorCache.delete(cacheKey);
      } catch (err: any) {
        if (!axios.isCancel(err) && mountedRef.current) {
          const msg =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Unknown error';
          setError(msg);
          setData(null);
          errorCache.set(cacheKey, msg);
          setTimeout(() => errorCache.delete(cacheKey), 120000);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [endpoint, params]);

  return { data, loading, error };
}