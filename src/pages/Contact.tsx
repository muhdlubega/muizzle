import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../styles/Contact.css'

const Contact = () => {
    const navigate = useNavigate();

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

    return (
        <div>
            <Navbar />
            <div className="contact-container">
                <h3 className="contact-title">Contact Us</h3>
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
                    <button
                        className="contact-submit"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            <button className="contact-close" onClick={() => navigate("/")}>
                Return to Homepage
            </button>
            </div>
        </div>
    );
};

export default Contact;
