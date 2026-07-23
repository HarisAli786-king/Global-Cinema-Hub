import { useEffect } from 'react';

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense load error:', err);
    }
  }, []);

  return (
    <div className="px-4 py-4 md:px-10">
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          Advertisement
        </p>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-6550313871482375"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
