import logo from './logo.jpg'
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Mail,
  Phone,
  User,
  Users,
  Building2,
  MapPin,
  ClipboardList,
  CircleDashed,
  ShieldCheck,
  Save,
  Send,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";

const STORAGE_KEY = "rhs_home80_fasttrack_submission_ready_v1";

const stepsMeta = [
  { id: 1, title: "Welcome", icon: Home },
  { id: 2, title: "Buyer Info", icon: User },
  { id: 3, title: "Readiness", icon: CircleDashed },
  { id: 4, title: "Documents", icon: FileText },
  { id: 5, title: "Lender", icon: Building2 },
  { id: 6, title: "Review", icon: ShieldCheck },
];

const readinessItems = [
  "Spoken with lender",
  "Have tax return",
  "Have pay stubs",
  "Have 2 months of bank statements",
  "Can contribute $1,000",
  "Will complete homebuyer class",
];

const requiredDocs = [
  "Most recent tax return + W-2s/1099s",
  "Pay stubs",
  "2 months bank statements",
  "Government-issued ID",
  "Homebuyer education certificate",
];

const progressSteps = [
  "Pre-qualified with lender",
  "Documents collected",
  "Homebuyer class completed",
  "Application submitted",
  "Approved",
  "Under contract",
  "Loan finalized",
  "Closed",
];

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  householdSize: "",
  preferredArea: "",
  readiness: {},
  documents: {},
  lenderName: "",
  loanOfficer: "",
  lenderPhone: "",
  lenderEmail: "",
  progress: {},
};

function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}

function StepPill({ active, complete, title, icon: Icon, index }) {
  return (
    <div
      className={cls(
        "flex items-center gap-3 rounded-2xl border px-3 py-3 transition",
        active
          ? "border-emerald-700 bg-emerald-50"
          : complete
          ? "border-stone-300 bg-white"
          : "border-stone-200 bg-stone-50"
      )}
    >
      <div
        className={cls(
          "flex h-10 w-10 items-center justify-center rounded-full",
          active
            ? "bg-emerald-700 text-white"
            : complete
            ? "bg-stone-900 text-white"
            : "bg-white text-stone-500 ring-1 ring-stone-200"
        )}
      >
        {complete && !active ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Step {index + 1}</div>
        <div className="text-sm font-semibold text-stone-900">{title}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, right }) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-stone-200">
      <div className="border-b border-stone-200 px-6 py-5 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-stone-600">{subtitle}</p> : null}
          </div>
          {right}
        </div>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

function Field({ label, placeholder, value, onChange, type = "text", icon: Icon, error, required }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-stone-800">
        {label} {required ? <span className="text-rose-600">*</span> : null}
      </span>
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /> : null}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cls(
            "w-full rounded-2xl border bg-stone-50 py-3 outline-none transition focus:bg-white",
            Icon ? "pl-11 pr-4" : "px-4",
            error ? "border-rose-400 focus:border-rose-600" : "border-stone-300 focus:border-emerald-700"
          )}
        />
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </label>
  );
}

function StatusBadge({ tone = "neutral", children }) {
  const toneClasses = {
    neutral: "bg-stone-100 text-stone-700 ring-stone-200",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warn: "bg-amber-50 text-amber-800 ring-amber-200",
    danger: "bg-rose-50 text-rose-800 ring-rose-200",
  };
  return <div className={`rounded-full px-4 py-2 text-sm font-medium ring-1 ${toneClasses[tone]}`}>{children}</div>;
}

export default function RHSHOME80FastTrackWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [submitNotice, setSubmitNotice] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm(parsed.form || initialForm);
        setCurrentStep(parsed.currentStep || 0);
        setSubmitted(Boolean(parsed.submitted));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ form, currentStep, submitted })
      );
    } catch (e) {}
  }, [form, currentStep, submitted]);

  useEffect(() => {
    if (!saveNotice) return;
    const t = setTimeout(() => setSaveNotice(""), 1800);
    return () => clearTimeout(t);
  }, [saveNotice]);

  useEffect(() => {
    if (!submitNotice) return;
    const t = setTimeout(() => setSubmitNotice(""), 3200);
    return () => clearTimeout(t);
  }, [submitNotice]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const readinessCount = Object.values(form.readiness).filter((v) => v === "yes").length;
  const docsCount = Object.values(form.documents).filter(Boolean).length;
  const progressCount = Object.values(form.progress).filter(Boolean).length;

  const completedSections = useMemo(() => {
    let count = 0;
    count += 1;
    if (form.fullName && form.phone && form.email && form.householdSize) count += 1;
    if (Object.keys(form.readiness).length >= 4) count += 1;
    if (docsCount >= 3) count += 1;
    if (form.lenderName || form.loanOfficer || form.lenderEmail || form.lenderPhone) count += 1;
    if (submitted || currentStep === 5) count += 1;
    return count;
  }, [form, docsCount, submitted, currentStep]);

  const percent = Math.round((completedSections / stepsMeta.length) * 100);

  const exportSummary = () => {
    const lines = [
      "RHS HOME 80 FAST TRACK SUMMARY",
      "",
      `Buyer: ${form.fullName || ""}`,
      `Phone: ${form.phone || ""}`,
      `Email: ${form.email || ""}`,
      `Household Size: ${form.householdSize || ""}`,
      `Preferred Area: ${form.preferredArea || ""}`,
      "",
      "READINESS:",
      ...readinessItems.map((item) => `- ${item}: ${form.readiness[item] || "not answered"}`),
      "",
      "DOCUMENTS:",
      ...requiredDocs.map((doc) => `- ${doc}: ${form.documents[doc] ? "checked" : "not checked"}`),
      "",
      "LENDER:",
      `Lender Name: ${form.lenderName || ""}`,
      `Loan Officer: ${form.loanOfficer || ""}`,
      `Lender Phone: ${form.lenderPhone || ""}`,
      `Lender Email: ${form.lenderEmail || ""}`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rhs-home80-fast-track-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const manualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, currentStep, submitted }));
      setSaveNotice("Progress saved");
    } catch (e) {
      setSaveNotice("Save unavailable");
    }
  };

  const resetAll = () => {
    setForm(initialForm);
    setCurrentStep(0);
    setSubmitted(false);
    setErrors({});
    setSubmitNotice("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 1) {
      if (!form.fullName.trim()) nextErrors.fullName = "Enter buyer full name.";
      if (!form.phone.trim()) nextErrors.phone = "Enter phone number.";
      if (!form.email.trim()) nextErrors.email = "Enter email address.";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
      if (!form.householdSize.trim()) nextErrors.householdSize = "Enter household size.";
    }

    if (step === 2) {
      if (Object.keys(form.readiness).length < 4) nextErrors.readiness = "Answer at least 4 readiness questions.";
    }

    if (step === 3) {
      if (docsCount < 3) nextErrors.documents = "Check at least 3 document items to continue.";
    }

    if (step === 4) {
      if (form.lenderEmail && !/^\S+@\S+\.\S+$/.test(form.lenderEmail)) nextErrors.lenderEmail = "Enter a valid lender email.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, stepsMeta.length - 1));
  };

  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const toggleDocument = (doc) => {
    setForm((prev) => ({ ...prev, documents: { ...prev.documents, [doc]: !prev.documents[doc] } }));
  };

  const toggleProgress = (step) => {
    setForm((prev) => ({ ...prev, progress: { ...prev.progress, [step]: !prev.progress[step] } }));
  };

  const handleSubmit = () => {
    const valid = [1, 2, 3, 4].every((s) => validateStep(s));
    if (!valid) {
      setCurrentStep(1);
      setSubmitNotice("Please complete the required items before submitting.");
      return;
    }
    setSubmitted(true);
    setCurrentStep(5);
    setSubmitNotice("Buyer summary is ready for RHS review.");
  };

  const reviewWarnings = [
    !form.fullName && "Buyer name is missing.",
    !form.email && "Buyer email is missing.",
    docsCount < 5 && `Only ${docsCount} of ${requiredDocs.length} document items are checked.`,
    readinessCount < 4 && "Buyer may still need prep before opening the official application.",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] bg-white shadow-xl ring-1 ring-stone-200">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-amber-600 to-rose-800 px-6 py-8 text-white md:px-8 md:py-10">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <img
                        src={logo}
                        alt="Residential Housing Solutions logo"
                        className="h-20 w-auto object-contain md:h-24"
                      />
                    </div>
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur md:text-sm">
                        Residential Housing Solutions
                      </div>
                      <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">HOME 80 Fast Track Wizard</h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
                        A submission-ready buyer workflow that saves progress, validates required fields, and creates a clean handoff into the official HOMEownership 80 application.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-[24px] bg-white/10 p-5 backdrop-blur md:min-w-[280px]">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Completion</div>
                      <div className="mt-1 text-3xl font-bold">{percent}%</div>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full bg-white" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={manualSave} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                        <Save className="h-4 w-4" /> Save
                      </button>
                      <button onClick={exportSummary} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                        <Download className="h-4 w-4" /> Export
                      </button>
                    </div>
                    {saveNotice ? <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">{saveNotice}</div> : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-stone-200 bg-stone-50 p-4 md:grid-cols-3 xl:grid-cols-6">
                {stepsMeta.map((step, idx) => (
                  <button key={step.id} onClick={() => setCurrentStep(idx)} className="text-left">
                    <StepPill active={idx === currentStep} complete={idx < currentStep || (submitted && idx === 5)} title={step.title} icon={step.icon} index={idx} />
                  </button>
                ))}
              </div>
            </section>

            <motion.div key={currentStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
              {currentStep === 0 && (
                <SectionCard
                  title="Welcome"
                  subtitle="This wizard is your shortcut. It is not a replacement for the official HOME 80 packet."
                  right={<StatusBadge tone="success">Start here</StatusBadge>}
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ["1", "Complete this guide", "Answer a few quick questions and track your progress."],
                      ["2", "Gather documents", "Use the checklist to get everything ready before you start the official packet."],
                      ["3", "Submit ready", "Create a clean handoff summary for RHS and move into the official application."],
                    ].map(([n, title, text]) => (
                      <div key={title} className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">{n}</div>
                        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {currentStep === 1 && (
                <SectionCard
                  title="Buyer Information"
                  subtitle="Basic contact details so RHS can guide the process and keep things moving."
                  right={<StatusBadge>Required fields</StatusBadge>}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Field label="Full name" required placeholder="Enter full name" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} icon={User} error={errors.fullName} />
                    </div>
                    <Field label="Phone" required placeholder="(555) 555-5555" value={form.phone} onChange={(e) => setField("phone", e.target.value)} icon={Phone} error={errors.phone} />
                    <Field label="Email" required placeholder="name@email.com" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} icon={Mail} error={errors.email} />
                    <Field label="Household size" required placeholder="Number of people in household" value={form.householdSize} onChange={(e) => setField("householdSize", e.target.value)} icon={Users} error={errors.householdSize} />
                    <Field label="Preferred area" placeholder="Neighborhood or area" value={form.preferredArea} onChange={(e) => setField("preferredArea", e.target.value)} icon={MapPin} />
                  </div>
                </SectionCard>
              )}

              {currentStep === 2 && (
                <SectionCard
                  title="Readiness Check"
                  subtitle="Quickly confirm what is ready and what still needs attention."
                  right={<StatusBadge tone="warn">Check yes or no</StatusBadge>}
                >
                  <div className="space-y-3">
                    {readinessItems.map((item) => (
                      <div key={item} className="flex flex-col gap-3 rounded-[22px] border border-stone-200 px-4 py-4 transition hover:bg-stone-50 md:flex-row md:items-center md:justify-between">
                        <div className="font-medium">{item}</div>
                        <div className="flex gap-3">
                          <label className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm hover:border-emerald-700 hover:text-emerald-800">
                            <input type="radio" name={item} checked={form.readiness[item] === "yes"} onChange={() => setForm((prev) => ({ ...prev, readiness: { ...prev.readiness, [item]: "yes" } }))} className="h-4 w-4" /> Yes
                          </label>
                          <label className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm hover:border-rose-700 hover:text-rose-800">
                            <input type="radio" name={item} checked={form.readiness[item] === "no"} onChange={() => setForm((prev) => ({ ...prev, readiness: { ...prev.readiness, [item]: "no" } }))} className="h-4 w-4" /> No
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.readiness ? <p className="mt-4 text-sm text-rose-700">{errors.readiness}</p> : null}
                </SectionCard>
              )}

              {currentStep === 3 && (
                <SectionCard
                  title="Required Documents"
                  subtitle="This checklist helps prevent the most common delay: submitting an incomplete file."
                  right={<StatusBadge>Check what you have</StatusBadge>}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {requiredDocs.map((doc) => (
                      <label key={doc} className="flex items-center gap-3 rounded-[22px] border border-stone-200 bg-stone-50 px-4 py-4 transition hover:bg-white hover:shadow-sm">
                        <input type="checkbox" checked={Boolean(form.documents[doc])} onChange={() => toggleDocument(doc)} className="h-5 w-5 rounded" />
                        <span className="font-medium">{doc}</span>
                      </label>
                    ))}
                  </div>
                  {errors.documents ? <p className="mt-4 text-sm text-rose-700">{errors.documents}</p> : null}
                </SectionCard>
              )}

              {currentStep === 4 && (
                <SectionCard
                  title="Lender Information"
                  subtitle="Optional, but helpful for coordination and follow-through."
                  right={<StatusBadge>Optional section</StatusBadge>}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Field label="Lender name" placeholder="Company name" value={form.lenderName} onChange={(e) => setField("lenderName", e.target.value)} icon={Building2} />
                    </div>
                    <Field label="Loan officer" placeholder="Loan officer name" value={form.loanOfficer} onChange={(e) => setField("loanOfficer", e.target.value)} icon={User} />
                    <Field label="Phone" placeholder="Phone number" value={form.lenderPhone} onChange={(e) => setField("lenderPhone", e.target.value)} icon={Phone} />
                    <div className="md:col-span-2">
                      <Field label="Email" placeholder="Loan officer email" type="email" value={form.lenderEmail} onChange={(e) => setField("lenderEmail", e.target.value)} icon={Mail} error={errors.lenderEmail} />
                    </div>
                  </div>
                </SectionCard>
              )}

              {currentStep === 5 && (
                <SectionCard
                  title="Review & Submission"
                  subtitle="This summary creates a clean handoff into the official HOME 80 application and RHS follow-up."
                  right={<StatusBadge tone="success">Ready to continue</StatusBadge>}
                >
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
                        <h3 className="text-lg font-semibold">Buyer Summary</h3>
                        <div className="mt-4 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
                          <div><span className="font-semibold">Name:</span> {form.fullName || "—"}</div>
                          <div><span className="font-semibold">Phone:</span> {form.phone || "—"}</div>
                          <div><span className="font-semibold">Email:</span> {form.email || "—"}</div>
                          <div><span className="font-semibold">Household size:</span> {form.householdSize || "—"}</div>
                          <div className="md:col-span-2"><span className="font-semibold">Preferred area:</span> {form.preferredArea || "—"}</div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-stone-200 bg-white p-5">
                        <h3 className="text-lg font-semibold">Submission Notes</h3>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                          <p>Ready answers: <span className="font-semibold">{readinessCount} of {readinessItems.length}</span></p>
                          <p>Documents checked: <span className="font-semibold">{docsCount} of {requiredDocs.length}</span></p>
                          <p>Buyer process steps checked: <span className="font-semibold">{progressCount} of {progressSteps.length}</span></p>
                        </div>
                        {reviewWarnings.length ? (
                          <div className="mt-4 rounded-[20px] bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
                            <div className="mb-2 flex items-center gap-2 font-semibold"><AlertCircle className="h-4 w-4" /> Review before sending</div>
                            <ul className="space-y-1">
                              {reviewWarnings.map((w) => <li key={w}>• {w}</li>)}
                            </ul>
                          </div>
                        ) : (
                          <div className="mt-4 rounded-[20px] bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
                            Buyer file looks strong for the next step.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 rounded-[24px] bg-stone-900 p-6 text-white shadow-xl">
                      <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                        Final Step
                      </div>
                      <h3 className="text-2xl font-semibold">Submission-ready handoff</h3>
                      <p className="text-sm leading-6 text-white/85">
                        Use the buttons below to export the buyer summary, save progress, or move into the official application step.
                      </p>
                      <div className="grid gap-3">
                        <button onClick={exportSummary} className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-emerald-700 px-5 py-3.5 text-base font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:opacity-95">
                          <Download className="h-4 w-4" /> Export Buyer Summary
                        </button>
                        <button onClick={manualSave} className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-white/10 px-5 py-3.5 text-base font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15">
                          <Save className="h-4 w-4" /> Save Progress
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-white px-5 py-3.5 text-base font-semibold text-stone-900 transition hover:translate-y-[-1px]">
                          <Send className="h-4 w-4" /> Continue to Official Application
                        </button>
                      </div>
                      {submitNotice ? <div className="rounded-[20px] bg-white/10 p-4 text-sm text-white/90 ring-1 ring-white/10">{submitNotice}</div> : null}
                    </div>
                  </div>
                </SectionCard>
              )}
            </motion.div>

            <div className="flex items-center justify-between gap-4 rounded-[28px] bg-white px-5 py-4 shadow-xl ring-1 ring-stone-200 md:px-6">
              <button onClick={prev} disabled={currentStep === 0} className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 px-4 py-3 font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              <div className="text-center text-sm text-stone-600">
                Step <span className="font-semibold text-stone-900">{currentStep + 1}</span> of <span className="font-semibold text-stone-900">{stepsMeta.length}</span>
              </div>

              {currentStep < stepsMeta.length - 1 ? (
                <button onClick={next} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:opacity-95">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:opacity-95">
                  Finish <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <section className="overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-stone-200">
                <div className="border-b border-stone-200 px-6 py-5">
                  <h2 className="text-2xl font-semibold">Live Progress</h2>
                  <p className="mt-1 text-sm text-stone-600">A simple, motivating snapshot for buyers.</p>
                </div>
                <div className="space-y-4 p-6">
                  <div className="rounded-[22px] bg-stone-50 p-4 ring-1 ring-stone-200">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Form completion</div>
                    <div className="mt-1 text-3xl font-bold text-stone-900">{percent}%</div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-200">
                      <div className="h-full rounded-full bg-emerald-700" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <div className="rounded-[22px] border border-stone-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Ready items</div>
                      <div className="mt-1 text-2xl font-bold">{readinessCount}/6</div>
                    </div>
                    <div className="rounded-[22px] border border-stone-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Docs checked</div>
                      <div className="mt-1 text-2xl font-bold">{docsCount}/5</div>
                    </div>
                    <div className="rounded-[22px] border border-stone-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Process steps</div>
                      <div className="mt-1 text-2xl font-bold">{progressCount}/8</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-stone-200">
                <div className="border-b border-stone-200 px-6 py-5">
                  <h2 className="text-2xl font-semibold">Buyer Process Tracker</h2>
                  <p className="mt-1 text-sm text-stone-600">Keeps the next steps visible and motivating.</p>
                </div>
                <div className="space-y-3 p-6">
                  {progressSteps.map((step, idx) => (
                    <label key={step} className="flex items-center gap-3 rounded-[22px] border border-stone-200 px-4 py-4 transition hover:bg-stone-50">
                      <input type="checkbox" checked={Boolean(form.progress[step])} onChange={() => toggleProgress(step)} className="h-5 w-5 rounded" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Step {idx + 1}</div>
                        <div className="font-medium">{step}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-[28px] bg-stone-900 text-white shadow-xl">
                <div className="p-6">
                  <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                    Important
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold">Submission-Ready Features</h3>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-white/85">
                    <p>• Auto-saves progress in the browser.</p>
                    <p>• Validates required fields before moving forward.</p>
                    <p>• Exports a buyer summary for RHS review and follow-up.</p>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <button onClick={resetAll} className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-white/10 px-5 py-3.5 text-base font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15">
                      <RefreshCw className="h-4 w-4" /> Reset Form
                    </button>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-stone-200">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold">RHS Contact</h3>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-stone-700">
                    <p className="font-semibold">Residential Housing Solutions</p>
                    <p>Website: myrhs.net</p>
                    <p>Use this guided tool as your shortcut, then complete the official HOME 80 application packet.</p>
                  </div>
                  <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-stone-900 px-5 py-3.5 text-base font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:opacity-95">
                    <ClipboardList className="h-4 w-4" /> Contact RHS
                  </button>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
