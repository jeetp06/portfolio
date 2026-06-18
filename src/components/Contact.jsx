import { useState } from "react";
import { LINKS, RESUME_URL } from "../data/portfolioData";
import Eyebrow from "./Eyebrow";

export default function Contact() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const updateContact = (field) => (e) => {
    setContactForm((form) => ({ ...form, [field]: e.target.value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${contactForm.name || "your website"}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`
    );
    window.location.href = `${LINKS.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="section contact" id="contact">
      <div data-reveal>
        <Eyebrow>contact</Eyebrow>
        <h2 className="contactBig">Let&apos;s build something.</h2>
        <p className="contactSub">Open to internships and new-grad roles in software, ML, and data.</p>
        <form className="contactForm" onSubmit={sendEmail}>
          <div className="formGrid">
            <label>
              <span>Name</span>
              <input type="text" value={contactForm.name} onChange={updateContact("name")} placeholder="Your name" required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={contactForm.email} onChange={updateContact("email")} placeholder="you@example.com" required />
            </label>
          </div>
          <label>
            <span>Message</span>
            <textarea value={contactForm.message} onChange={updateContact("message")} placeholder="Tell me what you want to build..." rows="6" required />
          </label>
          <button className="btn primary" type="submit">Send Email</button>
        </form>
        <div className="contactRow">
          <a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn -&gt;</a>
          <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">GitHub -&gt;</a>
          <a className="btn" href={RESUME_URL} download>Download resume</a>
        </div>
      </div>
    </section>
  );
}
