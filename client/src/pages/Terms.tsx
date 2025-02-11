import React from "react";
import { Scroll } from "lucide-react";

export const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Scroll className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="font-nohemi text-2xl md:text-4xl">
            Terms and Conditions
          </h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-sm md:text-base text-gray-400">
            Effective Date: February 11th, 2025
          </p>

          <p className="text-sm md:text-base">
            Welcome to thirdeye. By accessing or using this Website, you agree
            to comply with and be bound by these Terms and Conditions. If you do
            not agree with these terms, please do not use our Website.
          </p>

          <div className="space-y-6 md:space-y-8">
            <section>
              <h2 className="font-nohemi text-xl md:text-2xl text-primary mb-3 md:mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm md:text-base">
                By accessing this Website, you confirm that you are at least 18
                years old and legally capable of entering into binding
                contracts. Your use of the Website constitutes your acceptance
                of these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="font-nohemi text-xl md:text-2xl text-primary mb-3 md:mb-4">
                2. Modifications to Terms
              </h2>
              <p className="text-sm md:text-base">
                We reserve the right to modify these Terms at any time. Changes
                will take effect immediately upon posting on this page, and it
                is your responsibility to review these terms periodically.
              </p>
            </section>

            <section>
              <h2 className="font-nohemi text-xl md:text-2xl text-primary mb-3 md:mb-4">
                3. Use of the Website
              </h2>
              <p className="text-sm md:text-base">
                You agree to use the Website only for lawful purposes. You are
                prohibited from:
              </p>
              <ul className="list-disc pl-4 md:pl-6 mt-2 space-y-2 text-sm md:text-base">
                <li>Using the Website to engage in illegal activities.</li>
                <li>
                  Uploading or transmitting any viruses or malicious code.
                </li>
                <li>Attempting to hack or disrupt the Website's security.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-nohemi text-xl md:text-2xl text-primary mb-3 md:mb-4">
                4. Investment Disclaimer
              </h2>
              <ul className="list-disc pl-4 md:pl-6 space-y-2 text-sm md:text-base">
                <li>
                  <strong>Free Will Investments:</strong> Any investment
                  decisions you make are solely at your own discretion and based
                  on your free will. We do not exert any influence or pressure
                  over your choices.
                </li>
                <li>
                  <strong>Informational Purposes Only:</strong> All information
                  provided on this Website is for informational and educational
                  purposes only. It should not be considered as financial,
                  legal, or investment advice.
                </li>
                <li>
                  <strong>Personal Responsibility:</strong> Whatever you decide
                  to do, including any investment, is entirely your decision and
                  responsibility. We shall not be liable for any financial
                  losses or damages resulting from your decisions.
                </li>
                <li>
                  <strong>Expert Contributions:</strong> While the information
                  on this Website is curated with input from top experts in the
                  field, it does not necessarily reflect your individual
                  circumstances or input.
                </li>
                <li>
                  <strong>Best Efforts:</strong> We strive to provide the most
                  accurate and valuable investment information to the best of
                  our ability, but we do not guarantee accuracy, completeness,
                  or profitability.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-nohemi text-xl md:text-2xl text-primary mb-3 md:mb-4">
                5. Contact Us
              </h2>
              <p className="text-sm md:text-base">
                For questions or concerns about these Terms and Conditions,
                please contact us at:
              </p>
              <p className="mt-2 text-sm md:text-base">
                Email:{" "}
                <a
                  href="mailto:thirdeye1131@gmail.com"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  thirdeye1131@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
