import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: 1,
    question: "How does the AI detect recurring payments?",
    answer: "Our AI analyzes your bank statements for patterns in merchant names, amounts, and payment frequencies to identify subscription services and recurring charges. It looks for transactions that occur at regular intervals with consistent amounts."
  },
  {
    id: 2,
    question: "What file formats are supported for bank statements?",
    answer: "We support PDF, JPG, and PNG formats for bank statement uploads. Our OCR technology can extract text from image-based statements as well as PDF documents."
  },
  {
    id: 3,
    question: "How many months of statements do I need to upload?",
    answer: "Minimum 2 months required for accurate recurring payment detection. However, we recommend uploading 3-6 months of statements for better analysis and more comprehensive results."
  },
  {
    id: 4,
    question: "Is my banking information secure?",
    answer: "Yes, all data is stored locally on secure servers with encryption. We only analyze transaction patterns, not store sensitive account details like account numbers or balances. Your privacy and security are our top priorities."
  },
  {
    id: 5,
    question: "How often will I receive reminder emails?",
    answer: "Monthly reminders are sent to your registered email address by default, with options to customize frequency. You can choose weekly, bi-weekly, monthly, or quarterly reminders based on your preferences."
  },
  {
    id: 6,
    question: "Can I stop subscriptions directly through the website?",
    answer: "The website identifies subscriptions and provides guidance, but you'll need to cancel directly with the service provider. We provide links and contact information to make the cancellation process as easy as possible."
  }
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-claude-gray-600">Find answers to common questions about RecurringAI.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id} className="bg-white rounded-xl border border-claude-gray-200">
            <Button
              variant="ghost"
              className="w-full p-6 text-left justify-between hover:bg-transparent focus:bg-transparent"
              onClick={() => toggleFaq(faq.id)}
              data-testid={`faq-question-${faq.id}`}
            >
              <h3 className="text-lg font-medium text-claude-gray-900 text-left">
                {faq.question}
              </h3>
              <ChevronDown 
                className={cn(
                  "text-claude-gray-500 transition-transform flex-shrink-0 ml-4",
                  openFaq === faq.id && "rotate-180"
                )}
              />
            </Button>
            {openFaq === faq.id && (
              <CardContent className="px-6 pb-6 pt-0">
                <p className="text-claude-gray-700" data-testid={`faq-answer-${faq.id}`}>
                  {faq.answer}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
