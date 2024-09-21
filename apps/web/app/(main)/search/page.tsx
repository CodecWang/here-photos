'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function Search() {
  const params = useSearchParams();

  const query = params.get('q');

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 transition-all duration-500">
      {query}
    </div>
  );
}
