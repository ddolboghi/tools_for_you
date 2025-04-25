import Script from "next/script";

export default function GoogleAdsense() {
  const pid = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pid}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    ></Script>
  );
}
