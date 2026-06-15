type Props = {
  size?: number;
  className?: string;
};

/** Teal krog z belo pulzno črto — kot na marketinškem mockupu. */
export function BurnoutLogoMark({ size = 36, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="20" cy="20" r="20" className="fill-teal-700 dark:fill-teal-600" />
      <path
        d="M9 21.5h4.2l2.8-7.5 3.4 13 2.9-8.8H29"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
