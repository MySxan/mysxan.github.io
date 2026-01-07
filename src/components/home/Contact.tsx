// Contact section component - contact form and social links
import { useState } from "react";
import { Section } from "../ui/Section";
import { Toast, type ToastType } from "../ui/Toast";
import { links } from "../../data/links";

export function Contact() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const email = "mysxan@163.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setToast({ message: "Email copied to clipboard!", type: "success" });
    } catch {
      setToast({ message: "Failed to copy email", type: "error" });
    }
  };

  return (
    <Section id="contact" title="Contact" className="contact-section">
      <div className="contact-wrapper">
        <div className="contact-glass-card">
          <div className="contact-layout">
            {/* Left: intro */}
            <div className="contact-intro">
              <p className="contact-description">
                I'm always interested in hearing about new projects and
                opportunities.
              </p>
            </div>

            {/* Right: contact card */}
            <div className="contact-info-card">
              <div className="contact-card-inner">
                {/* Email row */}
                <div className="contact-field">
                  <div className="contact-field-content">
                    <p className="contact-field-label">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="contact-field-value"
                      title={email}
                    >
                      {email}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Copy email address"
                    aria-label="Copy email to clipboard"
                    className="contact-copy-btn"
                  >
                    Copy
                  </button>
                </div>

                <div className="contact-divider" />

                {/* Tel row */}
                <div className="contact-field-single">
                  <p className="contact-field-label">Tel</p>
                  <a href="tel:+12176373373" className="contact-field-value">
                    217-637-3373
                  </a>
                </div>

                {/* Social */}
                <div className="contact-social-section">
                  <p className="contact-field-label">Connect</p>

                  <div className="contact-social-links">
                    {links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-social-link"
                        aria-label={link.label}
                        title={link.label}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Section>
  );
}
