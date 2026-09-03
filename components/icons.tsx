/*
  Material Symbols paths, which use a 0 -960 960 960 viewBox rather than the
  0 0 24 24 of the older Material Icons set. Inlined so the icons need no font
  download and inherit the surrounding text colour.
*/

type IconProps = { className?: string };

export function ArrowOutward({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M216-160l-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
    </svg>
  );
}

export function ArrowBack({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  );
}

export function ArrowForward({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
    </svg>
  );
}

export function ExpandMore({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
  );
}
