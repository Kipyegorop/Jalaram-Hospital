import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormData } from "./types";

interface AppointmentTimeFieldsProps {
  form: UseFormReturn<AppointmentFormData>;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlots: string[];
}

const AppointmentTimeFields = ({ form, date, setDate, timeSlots }: AppointmentTimeFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <FormLabel>Preferred Date</FormLabel>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date < new Date() || date.getDay() === 0}
        />
      </div>

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Time</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AppointmentTimeFields;