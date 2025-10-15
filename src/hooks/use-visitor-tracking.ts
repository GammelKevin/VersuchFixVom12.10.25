"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useVisitorTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages or login page
    if (pathname.startsWith('/admin') || pathname === '/login') {
      return;
    }

    // ✅ DSGVO: Check for analytics consent BEFORE tracking
    const checkConsent = () => {
      try {
        const consentStr = localStorage.getItem('cookie_consent');
        if (!consentStr) return false;
        const consent = JSON.parse(consentStr);
        return consent.analytics === true;
      } catch {
        return false;
      }
    };

    // Only track if consent is given
    if (!checkConsent()) {
      console.log('[Visitor Tracking] No analytics consent - tracking disabled');
      return;
    }

    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('visitor_session');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('visitor_session', sessionId);
    }

    // Track the visit
    fetch('/api/visitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: pathname,
        sessionId: sessionId,
      }),
    }).catch(console.error);
  }, [pathname]);
}

