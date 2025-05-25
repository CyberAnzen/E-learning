import React, { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 px-6 pt-20 pb-20">
      <div className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to our Privacy Policy page. Your privacy is important to us and we are committed to protecting your personal information.
            </p>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website.
              Please read this policy carefully. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
            <h2 className="text-xl font-semibold">2. Information Collection</h2>
            <p>
              We may collect personal information such as your name, email address, and any other information you provide when you register or use our services.
            </p>
            <h2 className="text-xl font-semibold">3. Use of Information</h2>
            <p>
              The information we collect is used to provide, maintain, and improve our services, communicate with you, and personalize your experience.
            </p>
            <h2 className="text-xl font-semibold">4. Data Security</h2>
            <p>
              We implement a variety of security measures to ensure the safety of your personal information. However, no method of transmission over the Internet is completely secure.
            </p>
            <h2 className="text-xl font-semibold">5. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page.
              Your continued use of our services after any changes signifies your acceptance of the updated policy.
            </p>
            <h2 className="text-xl font-semibold">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
