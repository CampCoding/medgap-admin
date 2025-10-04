'use client';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { conifgs } from '../../config';

export default function AuthLayout({ children }) {
  const [isLoading, setIsLoading] = useState(false);  // State to manage loading
  const user_token = typeof window !== 'undefined' ? localStorage.getItem(conifgs?.localStorageTokenName) : null;
  const token = Cookies.get("medgap_refresh_token");
  const router = useRouter();

  useEffect(() => {
    // Check the token on the client side after render
    if (!token || !user_token) {
      router.replace("/login");
    } else {
      setIsLoading(false);  // Allow rendering of children after token check
    }
  }, [token, user_token, router]);

  // While loading (i.e., checking for tokens), show nothing or a loader
  if (isLoading) {
    return <div>Loading...</div>;  // You can customize this with a spinner or something else
  }

  return <div>{children}</div>;
}
