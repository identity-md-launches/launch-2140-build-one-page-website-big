import { useEffect, useRef, useState } from "react";
import { coats, Dog, type Coat } from "./Dog";

const titles = [
  "Certified good dog",
  "Head of snack security",
  "Professional blanket thief",
  "Small legs, big feelings",
];

function Badge({
  name,
  coat,
  title,
}: {
  name: string;
  coat: Coat;
  title: string;
}) {
  const c = coats.find((item) => item.id === coat)!;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 600"
      role="img"
      aria-label={`Big Weenies Unite badge for ${name || "your weenie"}: ${title}`}
    >
      <rect width="600" height="600" rx="48" fill="#f6e884" />
      <rect
        x="21"
        y="21"
        width="558"
        height="558"
        rx="34"
        fill="none"
        stroke="#582d23"
        strokeWidth="2"
      />
      <text
        x="300"
        y="83"
        fill="#582d23"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="27"
      >
        Big Weenies Unite
      </text>
      <path d="M65 112h470" stroke="#582d23" strokeWidth="1.5" />
      <svg x="15" y="103" width="570" height="337" viewBox="0 0 680 460">
        <Dog coat={coat} />
      </svg>
      <circle cx="496" cy="157" r="34" fill={c.dark} />
      <path
        d="M481 157l11 11 20-23"
        stroke="#f6e884"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="300"
        y="453"
        fill="#582d23"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize={name.length > 12 ? 30 : 44}
        direction="auto"
      >
        {name || "Your weenie"}
      </text>
      <text
        x="300"
        y="495"
        fill="#582d23"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="22"
      >
        {title}
      </text>
      <text
        x="300"
        y="551"
        fill="#582d23"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="17"
      >
        Little legs. Big love.
      </text>
    </svg>
  );
}

export function BadgeMaker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [coat, setCoat] = useState<Coat>("cinnamon");
  const [title, setTitle] = useState(titles[0]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.body.classList.add("dialog-open");
      setStatus("");
    } else if (!open && el.open) {
      el.close();
      document.body.classList.remove("dialog-open");
    }
    return () => {
      document.body.classList.remove("dialog-open");
    };
  }, [open]);

  function download(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Enter a name to put on your badge.");
      setStatus("");
      nameInput.current?.focus();
      return;
    }
    setError("");
    try {
      const svg = preview.current?.querySelector("svg");
      if (!svg) throw new Error("Badge preview is unavailable");
      const markup = new XMLSerializer().serializeToString(svg);
      const url = URL.createObjectURL(
        new Blob(['<?xml version="1.0" encoding="UTF-8"?>' + markup], {
          type: "image/svg+xml;charset=utf-8",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      const slug =
        cleanName
          .normalize("NFKD")
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase() || "my-weenie";
      link.download = `${slug}-weenie-badge.svg`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setStatus("Your badge is ready. Check your downloads.");
    } catch {
      setStatus("The download could not start. Please try again.");
    }
  }

  return (
    <dialog
      ref={dialog}
      className="badge-dialog"
      aria-labelledby="badge-heading"
      aria-describedby="badge-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]',
          ),
        ].filter(
          (control) =>
            !(
              control instanceof HTMLInputElement &&
              control.type === "radio" &&
              !control.checked
            ),
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (
          (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-heading">
        <h2 id="badge-heading">Wear your weenie pride.</h2>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close badge maker"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <p id="badge-description">
        One very good dog. One very official-looking badge.
      </p>
      <div className="badge-layout">
        <div className="badge-preview" ref={preview}>
          <Badge name={name.trim()} coat={coat} title={title} />
        </div>
        <form onSubmit={download} noValidate>
          <div className="form-group">
            <label htmlFor="dog-name">Your weenie’s name</label>
            <input
              ref={nameInput}
              id="dog-name"
              name="dog-name"
              type="text"
              autoComplete="off"
              placeholder="e.g. Pickles"
              maxLength={18}
              value={name}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "name-hint name-error" : "name-hint"}
              onChange={(event) => {
                setName(event.target.value);
                if (event.target.value.trim()) setError("");
                setStatus("");
              }}
            />
            <span id="name-hint" className="hint">
              Dog name or human name. Up to 18 characters.
            </span>
            {error && (
              <span id="name-error" className="field-error">
                {error}
              </span>
            )}
          </div>
          <fieldset className="form-group coat-options">
            <legend>Pick a coat</legend>
            <div className="coat-row">
              {coats.map((option) => (
                <label
                  key={option.id}
                  className={`coat-option ${coat === option.id ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="coat"
                    value={option.id}
                    checked={coat === option.id}
                    onChange={() => {
                      setCoat(option.id);
                      setStatus("");
                    }}
                  />
                  <span
                    className="coat-swatch"
                    style={{ backgroundColor: option.body }}
                    aria-hidden="true"
                  >
                    {coat === option.id && (
                      <svg viewBox="0 0 24 24">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    )}
                  </span>
                  <span>{option.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-group">
            <label htmlFor="dog-title">Choose a job title</label>
            <select
              id="dog-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setStatus("");
              }}
            >
              {titles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="button button-primary download-button"
          >
            Download my badge{" "}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
            </svg>
          </button>
          <p className="hint privacy-note">
            Free SVG download. Your details stay in this tab.
          </p>
          <p className="download-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </dialog>
  );
}
