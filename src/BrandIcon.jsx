import { useState } from "react";

export default function BrandIcon({ tool }) {
  const [failed, setFailed] = useState(false);
  const domain = new URL(tool.url).hostname;
  const logo = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

  return (
    <span
      className={`mb-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-xs font-black text-zinc-950 ${tool.accent}`}
    >
      {!failed && (
        <img
          src={logo}
          alt=""
          className="h-full w-full object-cover p-1"
          onError={() => setFailed(true)}
        />
      )}
      {failed && tool.icon}
    </span>
  );
}
