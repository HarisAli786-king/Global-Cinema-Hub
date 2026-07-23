import { useEffect } from 'react';
import type { AdSlotId } from '../types';

interface AdSlotProps {
  id: AdSlotId;
  label?: string;
  className?: string;
  height?: string;
}

export default function AdSlot({ id, label = 'Advertisement', className = '' }: AdSlotProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense load error:', err);
    }
  }, []);

  return (
    <div className={`w-full my-4 flex flex-col items-center justify-center overflow-hidden text-center ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cinema-fog/40 mb-1">
        {label}
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6550313871482375"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
