interface Props {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={`flex flex-col w-full h-full rounded-xl bg-white p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
