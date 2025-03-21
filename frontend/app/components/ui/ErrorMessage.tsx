type ErrorMessageProps = {
    message: string;
  };
  
export default function ErrorMessage({ message }: ErrorMessageProps) {
return (
    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600">
    {message}
    </div>
);
}