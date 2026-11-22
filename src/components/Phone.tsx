import Image from "next/image";

// Telefon s obrazovkou aplikace (public/screens, skript npm run build:screens).
export function Phone({
  screen,
  alt,
  sizes,
  priority = false,
  className,
}: {
  screen: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`phone${className ? ` ${className}` : ""}`}>
      <Image src={`/screens/${screen}.webp`} width={780} height={1688} sizes={sizes} alt={alt} priority={priority} />
    </div>
  );
}
