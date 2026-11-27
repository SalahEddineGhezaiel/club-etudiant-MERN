// Small SVG icons drawn with paths, so they look the same on every OS (unlike emoji or text symbols)
const paths = {
  chevron: <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  star: <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" fill="currentColor" />,
  starOutline: (
    <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  ),
  people: (
    <g fill="currentColor">
      <circle cx="6" cy="5" r="2.6" />
      <path d="M1 13.5c0-2.6 2.2-4.3 5-4.3s5 1.7 5 4.3z" />
      <circle cx="11.6" cy="5.6" r="2" opacity="0.6" />
      <path d="M11.5 9.3c2 .1 3.5 1.6 3.5 3.7v.5h-3c0-1.7-.5-3.1-1.6-4z" opacity="0.6" />
    </g>
  ),
};

export default function Icon({ name, className = 'icon' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// Rating shown as 5 stars, with a text label for screen readers
export function Stars({ rating }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name={n <= rating ? 'star' : 'starOutline'} />
      ))}
    </span>
  );
}
