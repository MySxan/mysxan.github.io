// Contact section component - contact form and social links
import { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Section } from "../ui/Section";
import { Toast, type ToastType } from "../ui/Toast";
import { links } from "../../data/links";

export function Contact() {
  const { t } = useTranslation();
  const toastIdRef = useRef(0);
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: ToastType;
  } | null>(null);
  const emails = [
    { value: "mysxan@163.com", label: "MAIN" },
    { value: "429290808@qq.com", label: "QQ" },
  ];
  const tels = [
    { value: "+1 217 637 3373", label: "US" },
    { value: "+86 180 8648 4696", label: "CN" },
  ];

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toastIdRef.current += 1;
      setToast({
        id: toastIdRef.current,
        message: t("contact.toast.copySuccess"),
        type: "success",
      });
    } catch {
      toastIdRef.current += 1;
      setToast({
        id: toastIdRef.current,
        message: t("contact.toast.copyError"),
        type: "error",
      });
    }
  };

  return (
    <Section
      id="contact"
      title={t("contact.title")}
      className="contact-section"
    >
      <div className="contact-wrapper">
        <div className="contact-glass-card">
          <div className="contact-layout">
            {/* Left: intro */}
            <div className="contact-intro">
              <p className="contact-description">
                <Trans i18nKey="contact.description" components={{ br: <br /> }} />
              </p>
              <div className="contact-divider contact-divider-intro" />
              <div className="contact-social-section contact-social-intro">
                <p className="contact-field-label">
                  {t("contact.connectLabel")}
                </p>
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

            {/* Right: contact card */}
            <div className="contact-info-card">
              <div className="contact-card-inner">
                {/* Email row */}
                <div className="contact-field">
                  <div className="contact-field-content">
                    <p className="contact-field-label">
                      {t("contact.emailLabel")}
                    </p>
                    <div className="contact-email-list">
                      {emails.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handleCopy(item.value)}
                          title={t("contact.copyEmailTitle")}
                          aria-label={t("contact.copyEmailAria")}
                          className="contact-email-item"
                        >
                          <span className="contact-email-text">
                            {item.value}
                          </span>
                          <span className="contact-email-tag">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="contact-divider" />

                {/* Tel row */}
                <div className="contact-field-single">
                  <p className="contact-field-label">{t("contact.telLabel")}</p>
                  <div className="contact-tel-list">
                    {tels.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleCopy(item.value)}
                        title={t("contact.copyTelTitle")}
                        aria-label={t("contact.copyTelAria")}
                        className="contact-tel-item"
                      >
                        <span className="contact-tel-left">
                          <span className="contact-tel-prefix">
                            {item.value.split(" ")[0]}
                          </span>
                          <span className="contact-tel-number">
                            {item.value.split(" ").slice(1).join(" ")}
                          </span>
                        </span>
                        <span className="contact-tel-tag">{item.label}</span>
                      </button>
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
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Section>
  );
}
