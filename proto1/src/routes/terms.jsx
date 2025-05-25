import React, { useEffect } from "react";
import useFetchWithPopup from "../hooks/UseFetchWithPopup";

export default function Terms() {
  const { Responce, error, loading, Popup } = useFetchWithPopup("http://localhost:4000/api/product");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 px-6 pt-20 pb-20">
      {Popup()}
      <div className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to our platform. By accessing or using our services, you agree to be bound by these Terms and Conditions.
            </p>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              These Terms and Conditions govern your use of our website and services. Please read them carefully. If you do not agree to these terms, you should not use our services.
            </p>
            <h2 className="text-xl font-semibold">2. Use of the Service</h2>
            <p>
              You agree to use our services in compliance with all applicable laws and not for any unlawful or prohibited purpose.
            </p>
            <h2 className="text-xl font-semibold">3. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your visit to our website, to understand our practices.
            </p>
            <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
            <p>
              All content on this site, including text, graphics, logos, images, and software, is the property of our company or its licensors.
            </p>
            <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
            </p>
            <h2 className="text-xl font-semibold">6. Changes to the Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Your continued use of our services after any such changes constitutes your acceptance of the new terms.
            </p>
            <h2 className="text-xl font-semibold">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at support@example.com.
            </p>
            <p className="mt-4">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
