'use client';
import React, { useState } from 'react';
export default function useTest() {
  const [test, setTest] = useState<string>('');
  return { test, setTest };
}
