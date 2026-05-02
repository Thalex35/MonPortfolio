import { useState } from "react";
import "../styles/contact.css";

export default function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!formspreeEndpoint) {
      setStatus({
        type: "error",
        message:
          "Formspree is not configured yet. Add VITE_FORMSPREE_ENDPOINT in .env.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      setIsSending(true);
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Message sent successfully. I will get back to you soon.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="contact">
      <p className="contact_kicker">CONTACT</p>
      <h1>Let's work together.</h1>
      <p className="contact_intro">
        Open to internships, collaborations, or a conversation about tech.
        Don&apos;t hesitate.
      </p>

      <div className="contact_layout">
        <div className="contact_left">
          <p className="contact_copy">
            Whether you have a project in mind, an opportunity to share, or just
            want to connect - my inbox is always open.
          </p>

          <div className="contact_cards">
            <a
              className="contact_card"
              href="mailto:theodore.louisjuste@gmail.com"
            >
              <span className="contact_icon">✉</span>
              <div>
                <p className="contact_label">email</p>
                <p className="contact_value">
                  louisjuste.theodore.jr@gmail.com
                </p>
              </div>
            </a>

            <a
              className="contact_card"
              href="https://github.com/Thalex35"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact_icon">⌘</span>
              <div>
                <p className="contact_label">github</p>
                <p className="contact_value">github.com/theodore</p>
              </div>
            </a>

            <a
              className="contact_card"
              href="https://www.linkedin.com/in/theodore-louisjuste-763412407/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact_icon">in</span>
              <div>
                <p className="contact_label">linkedin</p>
                <p className="contact_value">linkedin.com/in/theodore</p>
              </div>
            </a>
          </div>
        </div>

        <form className="contact_form" onSubmit={handleSubmit}>
          <label htmlFor="contact-name">NAME</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
          />

          <label htmlFor="contact-email">EMAIL</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />

          <label htmlFor="contact-message">MESSAGE</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="What's on your mind?"
            rows={5}
            required
          />

          <input
            type="text"
            name="_gotcha"
            className="contact_honeypot"
            tabIndex={-1}
          />

          <button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send message"}
          </button>

          {status.message ? (
            <p
              className={`contact_status ${status.type === "success" ? "is_success" : "is_error"}`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
