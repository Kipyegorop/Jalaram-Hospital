interface CountdownAlertProps {
  countdown: number | null;
}

const CountdownAlert = ({ countdown }: CountdownAlertProps) => {
  if (countdown === null) return null;
  
  return (
    <div className="text-center mb-4 p-4 bg-green-50 rounded-lg">
      <p className="text-green-600">
        Redirecting to homepage in {countdown} seconds...
      </p>
    </div>
  );
};

export default CountdownAlert;