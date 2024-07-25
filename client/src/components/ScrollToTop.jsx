import React from 'react'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
export default function ScroolToTop() {
  const {pathName} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);
  return null;
}
