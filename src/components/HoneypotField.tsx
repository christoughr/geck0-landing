"use client";

/** Visually hidden honeypot — leave empty; bots auto-fill */
export default function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="_gotcha">Leave blank</label>
      <input
        id="_gotcha"
        name="_gotcha"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
