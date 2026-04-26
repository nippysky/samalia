// src/components/appointments/make-appointment-client.tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiX,
} from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import { useBrandToastStore } from "@/src/stores/brand-toast-store";

const LagosMapPanel = dynamic(() => import("./lagos-map-panel"), {
  ssr: false,
  loading: () => <MapPanelSkeleton />,
});

type AppointmentStep = "schedule" | "details";

type AppointmentFormState = {
  date: string;
  time: string;
  reason: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  prefix: string;
  phone: string;
  contactMethod: "email" | "phone";
  message: string;
};

const appointmentTimeSlots = [
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
];

const appointmentReasons = [
  "Bespoke consultation",
  "Private fitting",
  "Collection preview",
  "Personalisation enquiry",
  "Certificate of craft enquiry",
  "Gift appointment",
];

const titles = ["Mr", "Mrs", "Ms", "Dr"];

const initialState: AppointmentFormState = {
  date: "",
  time: "",
  reason: "Bespoke consultation",
  title: "",
  firstName: "",
  lastName: "",
  email: "",
  prefix: "+234",
  phone: "",
  contactMethod: "email",
  message: "",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatAppointmentDate(value: string) {
  const date = parseIsoDate(value);

  if (!date) return "Select date";

  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isPastTimeForSelectedDate(dateIso: string, time: string) {
  const selectedDate = parseIsoDate(dateIso);
  if (!selectedDate) return false;

  const now = new Date();
  const today = toDateOnly(now);

  if (!isSameDate(selectedDate, today)) return false;

  const [hour, minute] = time.split(":").map(Number);
  const slot = new Date(selectedDate);
  slot.setHours(hour ?? 0, minute ?? 0, 0, 0);

  const minimumNotice = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  return slot <= minimumNotice;
}

export function MakeAppointmentClient() {
  const reducedMotion = Boolean(useReducedMotion());
  const pushToast = useBrandToastStore((state) => state.pushToast);

  const [step, setStep] = React.useState<AppointmentStep>("schedule");
  const [form, setForm] = React.useState<AppointmentFormState>(initialState);
  const [submitted, setSubmitted] = React.useState(false);

  const messageLimit = 1500;
  const messageCharactersLeft = Math.max(0, messageLimit - form.message.length);

  function updateForm<K extends keyof AppointmentFormState>(
    key: K,
    value: AppointmentFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSelectDate(date: string) {
    setForm((current) => ({
      ...current,
      date,
      time:
        current.time && isPastTimeForSelectedDate(date, current.time)
          ? ""
          : current.time,
    }));
  }

  function canProceedToDetails() {
    return Boolean(form.date && form.time && form.reason);
  }

  function canSubmit() {
    return Boolean(
      form.title &&
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        form.phone.trim()
    );
  }

  function handleNext() {
    if (!canProceedToDetails()) {
      pushToast({
        variant: "info",
        title: "Complete schedule",
        message: "Select a date, time, and reason for your appointment.",
      });
      return;
    }

    setStep("details");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit()) {
      pushToast({
        variant: "info",
        title: "Complete details",
        message: "Fill the required fields before sending your request.",
      });
      return;
    }

    setSubmitted(true);

    pushToast({
      variant: "success",
      title: "Appointment request sent",
      message:
        "Your request has been received. Sam’Alia will contact you to confirm availability.",
    });

    window.setTimeout(() => {
      setSubmitted(false);
      setForm(initialState);
      setStep("schedule");
    }, 700);
  }

  return (
    <main className="min-h-[calc(100svh-var(--nav-h))] bg-white text-black">
      <div className="grid min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
        <LagosMapPanel />

        <aside className="relative border-t border-black/10 bg-white lg:border-l lg:border-t-0">
          <div className="flex min-h-[calc(100svh-var(--nav-h))] flex-col">
            <div className="shrink-0 border-b border-black/10 px-5 py-5 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black">
                    Make an appointment
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-black/42">
                    Lagos, Nigeria
                  </p>
                </div>

                <a
                  href="/bespoke-services"
                  aria-label="Close appointment page"
                  className="group flex size-11 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                >
                  <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
                </a>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 [-webkit-overflow-scrolling:touch] sm:px-8 lg:px-10 lg:py-10">
              <AnimatePresence mode="wait" initial={false}>
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="flex min-h-[52svh] items-center justify-center text-center"
                  >
                    <div className="max-w-90">
                      <div className="mx-auto flex size-14 items-center justify-center border border-black bg-black text-white">
                        <FiCheck className="size-5" />
                      </div>

                      <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.24em]">
                        Request received
                      </p>

                      <p className="mt-4 text-sm leading-7 text-black/58">
                        We will review your appointment request and contact you
                        to confirm the available slot.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={reducedMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {step === "schedule" ? (
                      <ScheduleStep
                        form={form}
                        onChange={updateForm}
                        onSelectDate={handleSelectDate}
                        onNext={handleNext}
                      />
                    ) : (
                      <DetailsStep
                        form={form}
                        messageCharactersLeft={messageCharactersLeft}
                        canSubmit={canSubmit()}
                        onBack={() => setStep("schedule")}
                        onChange={updateForm}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function MapPanelSkeleton() {
  return (
    <section className="relative min-h-[54svh] overflow-hidden bg-[#d7d7d7] lg:min-h-[calc(100svh-var(--nav-h))]">
      <div className="absolute inset-0 animate-pulse bg-linear-to-r from-black/4 via-black/8 to-black/4" />
      <div className="absolute left-0 top-0 h-28 w-2 bg-black lg:h-40" />
    </section>
  );
}

function ScheduleStep({
  form,
  onChange,
  onSelectDate,
  onNext,
}: {
  form: AppointmentFormState;
  onChange: <K extends keyof AppointmentFormState>(
    key: K,
    value: AppointmentFormState[K]
  ) => void;
  onSelectDate: (date: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div>
        <h1 className="text-[1.45rem] font-medium leading-tight tracking-[-0.035em] text-black">
          Private appointment
        </h1>

        <p className="mt-4 max-w-110 text-sm leading-7 text-black/58">
          Select a preferred date and time. Sam’Alia will confirm availability
          before the appointment is final.
        </p>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between gap-5">
          <p className="text-sm font-medium text-black">Date and time</p>
          <p className="text-sm text-black/42">* Required fields</p>
        </div>

        <div className="mt-8 space-y-10">
          <AppointmentCalendar
            selectedDate={form.date}
            onSelectDate={onSelectDate}
          />

          <TimeSlotPicker
            selectedDate={form.date}
            selectedTime={form.time}
            onSelectTime={(time) => onChange("time", time)}
          />

          <SelectField
            label="Reason of your visit*"
            value={form.reason}
            options={appointmentReasons}
            onChange={(value) => onChange("reason", value)}
          />
        </div>

        <div className="mt-9">
          <BrandButton
            type="button"
            fullWidth
            size="lg"
            variant="primary"
            iconAfter={<FiArrowRight className="size-4" />}
            onClick={onNext}
          >
            Next
          </BrandButton>
        </div>
      </div>
    </div>
  );
}

function AppointmentCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  const today = React.useMemo(() => toDateOnly(new Date()), []);
  const maxDate = React.useMemo(() => addDays(today, 90), [today]);
  const [visibleMonth, setVisibleMonth] = React.useState(() =>
    startOfMonth(today)
  );

  const selectedDateObject = selectedDate ? parseIsoDate(selectedDate) : null;

  const calendarCells = React.useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const leadingDays = monthStart.getDay();
    const gridStart = addDays(monthStart, -leadingDays);

    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [visibleMonth]);

  const canGoPrevious =
    startOfMonth(visibleMonth).getTime() > startOfMonth(today).getTime();

  function isDateSelectable(date: Date) {
    const current = toDateOnly(date);

    return current >= today && current <= maxDate;
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black">
            <FiCalendar className="size-3.5" />
            Date of your appointment*
          </p>

          <p className="mt-2 text-sm text-black/52">
            {selectedDate ? formatAppointmentDate(selectedDate) : "Choose a date"}
          </p>
        </div>

        <div className="flex items-center border border-black/10">
          <button
            type="button"
            disabled={!canGoPrevious}
            aria-label="Previous month"
            onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
            className="flex size-10 items-center justify-center text-black transition-colors duration-300 ease-luxury hover:bg-black hover:text-white disabled:pointer-events-none disabled:text-black/20"
          >
            <FiChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
            className="flex size-10 items-center justify-center border-l border-black/10 text-black transition-colors duration-300 ease-luxury hover:bg-black hover:text-white"
          >
            <FiChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 border border-black/10 bg-white p-3 sm:p-4">
        <div className="mb-4 flex items-center justify-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-black">
            {formatMonthLabel(visibleMonth)}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-[10px] uppercase tracking-[0.12em] text-black/36"
            >
              {day}
            </div>
          ))}

          {calendarCells.map((date) => {
            const isoDate = toIsoDate(date);
            const outsideMonth = date.getMonth() !== visibleMonth.getMonth();
            const selectable = isDateSelectable(date);
            const selected =
              selectedDateObject && isSameDate(date, selectedDateObject);
            const isToday = isSameDate(date, today);

            return (
              <button
                key={isoDate}
                type="button"
                disabled={!selectable}
                onClick={() => onSelectDate(isoDate)}
                className={cn(
                  "relative flex aspect-square min-h-10 items-center justify-center text-sm transition-colors duration-300 ease-luxury sm:min-h-11",
                  selected
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white",
                  outsideMonth && "text-black/24",
                  !selectable &&
                    "cursor-not-allowed text-black/18 hover:bg-white hover:text-black/18"
                )}
              >
                <span>{date.getDate()}</span>

                {isToday && !selected ? (
                  <span className="absolute bottom-1.5 h-px w-4 bg-black/45" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
}: {
  selectedDate: string;
  selectedTime: string;
  onSelectTime: (time: string) => void;
}) {
  return (
    <section>
      <div>
        <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black">
          <FiClock className="size-3.5" />
          Time preference*
        </p>

        <p className="mt-2 text-sm text-black/52">
          {selectedDate
            ? selectedTime || "Choose a time"
            : "Choose a date before selecting time"}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {appointmentTimeSlots.map((time) => {
          const disabled =
            !selectedDate || isPastTimeForSelectedDate(selectedDate, time);
          const active = selectedTime === time;

          return (
            <button
              key={time}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTime(time)}
              className={cn(
                "flex h-12 items-center justify-center border text-sm transition-colors duration-300 ease-luxury",
                active
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black hover:border-black hover:bg-black hover:text-white",
                disabled &&
                  "cursor-not-allowed border-black/10 text-black/20 hover:bg-white hover:text-black/20"
              )}
            >
              {time}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DetailsStep({
  form,
  messageCharactersLeft,
  canSubmit,
  onBack,
  onChange,
  onSubmit,
}: {
  form: AppointmentFormState;
  messageCharactersLeft: number;
  canSubmit: boolean;
  onBack: () => void;
  onChange: <K extends keyof AppointmentFormState>(
    key: K,
    value: AppointmentFormState[K]
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/45 transition-colors duration-300 ease-luxury hover:text-black"
      >
        <FiArrowLeft className="size-3.5" />
        Edit date and time
      </button>

      <div className="mt-8 border-b border-black/10 pb-8">
        <h1 className="text-[1.35rem] font-medium leading-tight tracking-[-0.035em] text-black">
          Enter your details
        </h1>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] gap-5 text-sm">
          <div>
            <p className="font-medium text-black">Date and time</p>
            <p className="mt-2 leading-6 text-black/62">
              {formatAppointmentDate(form.date)}
              <br />
              {form.time}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm text-black underline underline-offset-4 transition-colors duration-300 hover:text-black/55"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <p className="text-sm text-black/42">* Required fields</p>
      </div>

      <div className="mt-8 space-y-8">
        <SelectField
          label="Title*"
          value={form.title}
          placeholder="Select title"
          options={titles}
          onChange={(value) => onChange("title", value)}
        />

        <TextField
          label="First name*"
          value={form.firstName}
          onChange={(value) => onChange("firstName", value)}
        />

        <TextField
          label="Last name*"
          value={form.lastName}
          onChange={(value) => onChange("lastName", value)}
        />

        <TextField
          label="E-mail*"
          value={form.email}
          type="email"
          onChange={(value) => onChange("email", value)}
        />

        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black">
            Phone number*
          </p>

          <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3">
            <TextField
              label="Prefix"
              value={form.prefix}
              onChange={(value) => onChange("prefix", value)}
              hideLabel
            />

            <TextField
              label="Phone number"
              value={form.phone}
              type="tel"
              onChange={(value) => onChange("phone", value)}
              hideLabel
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-black">
            Preferred Contact Method*
          </p>

          <div className="mt-4 flex items-center gap-6">
            <RadioField
              label="Email"
              checked={form.contactMethod === "email"}
              onChange={() => onChange("contactMethod", "email")}
            />
            <RadioField
              label="Phone"
              checked={form.contactMethod === "phone"}
              onChange={() => onChange("contactMethod", "phone")}
            />
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm leading-7 text-black/62">
            Please enter any additional information to help us prepare for your
            appointment.
          </p>

          <label
            htmlFor="appointment-message"
            className="text-sm font-medium text-black"
          >
            Leave a message for our Studio Advisor
          </label>

          <textarea
            id="appointment-message"
            value={form.message}
            maxLength={1500}
            onChange={(event) => onChange("message", event.target.value)}
            className="mt-4 min-h-34 w-full resize-y border border-black/40 bg-white p-4 text-sm leading-7 text-black outline-none transition-colors duration-300 ease-luxury focus:border-black"
          />

          <p className="mt-2 text-xs text-black/45">
            {messageCharactersLeft.toLocaleString()} characters left
          </p>
        </div>

        <p className="text-xs leading-6 text-black/55">
          Information entered above will only be used to respond to your enquiry
          and prepare for your appointment. Sam’Alia will never release personal
          data without consent.
        </p>

        <BrandButton
          type="submit"
          fullWidth
          size="lg"
          variant={canSubmit ? "primary" : "secondary"}
          disabled={!canSubmit}
        >
          Send
        </BrandButton>
      </div>
    </form>
  );
}

function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-black">
        {label}
      </span>

      <span className="relative mt-3 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none border-0 border-b border-black/55 bg-transparent pr-10 text-base text-black outline-none transition-colors duration-300 ease-luxury focus:border-black"
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <FiChevronDown className="pointer-events-none absolute right-0 top-1/2 size-5 -translate-y-1/2 text-black" />
      </span>
    </label>
  );
}

function TextField({
  label,
  value,
  type = "text",
  hideLabel = false,
  onChange,
}: {
  label: string;
  value: string;
  type?: React.HTMLInputTypeAttribute;
  hideLabel?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span
        className={cn(
          "block text-[10px] font-medium uppercase tracking-[0.18em] text-black",
          hideLabel && "sr-only"
        )}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={hideLabel ? label : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full border-0 border-b border-black/55 bg-transparent text-base text-black outline-none transition-colors duration-300 ease-luxury placeholder:text-black/35 focus:border-black"
      />
    </label>
  );
}

function RadioField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-black">
      <span
        className={cn(
          "flex size-5 items-center justify-center border transition-colors duration-300 ease-luxury",
          checked ? "border-black" : "border-black/45"
        )}
      >
        {checked ? <span className="size-2.5 bg-black" /> : null}
      </span>

      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {label}
    </label>
  );
}