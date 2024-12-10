import Navbar from "../components/Navbar";
import "../styles/Contact.css";
import { Language } from "../types/types";
import Sidebar from "../components/Sidebar";

const Contact = ({ language }: { language: Language }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const enquiryInput = document.getElementById("enquiry") as HTMLInputElement;
    const email = emailInput.value;
    const enquiry = enquiryInput.value;
    const body = `Email for response: ${email}\n\nEnquiry:\n${enquiry}`;
    const encodedBody = encodeURIComponent(body);

    const mailtoLink = `mailto:muizzle.me@gmail.com?subject=Contact%20Muizzle&body=${encodedBody}`;
    window.location.href = mailtoLink;
  };

  const handleLanguageChange = (language: Language) => {
    localStorage.setItem("preferredLanguage", language);
  };

  return (
    <div>
      <Sidebar
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />
      <Navbar language={language} />
      <div className="contact-container">
        <h2 style={{ color: "#FF2247", textAlign: "start" }}>Contact Us</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="email"
            className="contact-email"
            placeholder="Enter your email here"
            required
            id="email"
          />
          <textarea
            className="contact-txtfield"
            placeholder="What would you like to ask?"
            required
            id="enquiry"
            rows={4}
          ></textarea>
          <button className="contact-submit" type="submit">
            Submit
          </button>
        </form>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1748896712033823"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1748896712033823"
          data-ad-slot="4565463408"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </div>
  );
};

export default Contact;
