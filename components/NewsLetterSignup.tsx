// NewsletterSignup.tsx
import React, { useState } from "react";

export interface NewsletterSignupProps {
  onSubscribe: (email: string) => Promise<void>;
}

export function NewsletterSignup({ onSubscribe }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreedToTerms) return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await onSubscribe(email);
      setStatus("success");
      setEmail("");
      setAgreedToTerms(false);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Newsletter Form">
      <h2>Subscribe to Newsletter</h2>

      {status === "success" && (
        <p role="status">Thank you for subscribing!</p>
      )}

      {status === "error" && (
        <p role="alert">{errorMessage}</p>
      )}

      <div>
        <label htmlFor="email-input">Email Address</label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            disabled={isSubmitting}
          />
          I agree to the terms and conditions
        </label>
      </div>

      <button type="submit" disabled={!agreedToTerms || !email || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Subscribe"}
      </button>
    </form>
  );
}