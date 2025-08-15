interface BookingButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function BookingButton({
  onClick,
  disabled = false,
  className = '',
  children = 'Book'
}: BookingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-b from-[#1e1e1d] to-[#000000] h-11 flex items-center justify-center px-4 py-2 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1),0px_4px_12px_0px_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span 
        className="font-bold text-white text-[18px] leading-[22px]"
        style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
      >
        {children}
      </span>
    </button>
  );
}
