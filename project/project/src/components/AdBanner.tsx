export function AdBanner() {
  return (
    <div className="px-4 py-6 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-0000000000000000"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <div className="flex h-24 items-center justify-center rounded-lg border border-white/10 bg-base-card text-xs uppercase tracking-[0.3em] text-white/30 md:h-28">
          Advertisement
        </div>
      </div>
    </div>
  );
}
