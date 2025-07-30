import React, { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated delay
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSuccess(true);
      setContactFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setContactSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-[#486e40]">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-2xl md:text-4xl font-playfair font-bold mb-4">
          Get in Touch
        </h1>
        <p className="text-2xl md:text-xl text-[#8F9779] max-w-2xl mx-auto">
          Have questions? We’d love to hear from you. Fill out the form and we’ll get back to you shortly.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div className="space-y-10">
          {/* Location */}
          <div className="flex items-start gap-4">
            <FiMapPin className="text-[#64973f] text-xl mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-1">Our Location</h3>
              <p className="text-[#8F9779]">Itahari-14, Sunsari, Nepal, 56705</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <FiPhone className="text-[#64973f] text-xl mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-1">Phone Number</h3>
              <p className="text-[#8F9779]">025-586144</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <FiMail className="text-[#64973f] text-xl mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-1">Email Address</h3>
              <p className="text-[#8F9779]">contact@example.com</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Business Hours</h3>
            <div className="text-[#8F9779] space-y-1">
              <p>
                Monday - Friday:{" "}
                <span className="text-[#486e40] font-medium">9:00 AM - 6:00 PM</span>
              </p>
              <p>
                Saturday:{" "}
                <span className="text-[#486e40] font-medium">10:00 AM - 4:00 PM</span>
              </p>
              <p>
                Sunday: <span className="text-[#486e40] font-medium">Closed</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-white border border-[#e8ede4] shadow-xl p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleContactSubmit} className="space-y-1">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={contactFormData.name}
                onChange={handleContactInputChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64973f] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={contactFormData.email}
                onChange={handleContactInputChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64973f] focus:outline-none"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={contactFormData.subject}
                onChange={handleContactInputChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64973f] focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                rows={5}
                value={contactFormData.message}
                onChange={handleContactInputChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64973f] focus:outline-none resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-[#64973f] hover:bg-[#5c8a42] text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <FiSend className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Success Message */}
          {contactSuccess && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl flex items-center text-green-800 gap-3">
              <FiCheckCircle className="text-xl" />
              <div>
                <p className="font-medium">Message sent successfully!</p>
                <p className="text-sm">We’ll get back to you shortly.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
