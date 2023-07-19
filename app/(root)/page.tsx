"use client"

import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect } from 'react';

function SetupPage() {
  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);

  useEffect(()=>{
    if(!isOpen) onOpen();
  }, [onOpen, isOpen]);

  return (
    <div className='p-4'>
      THis is the root
    </div>
  )
}

export default SetupPage;