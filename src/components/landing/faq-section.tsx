import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type FAQ = {
  value: string;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    value: "item-1",
    question: "How does it work?",
    answer:
      "Simply click on the Start Trading button on the home page and you will be directed to the web app where you can make your transactions through live chat.",
  },
  {
    value: "item-2",
    question: "What services do you offer and how do I start?",
    answer:
      "We buy gift cards and cryptocurrencies at profitable rates. To start, sign up with your email address and password.",
  },
  {
    value: "item-3",
    question: "How do I trade my gift cards?",
    answer:
      "Once signed in, click on the TRADE A GIFTCARD button, search or select the gift card you want to trade, and continue with either LIVE CHAT or WHATSAPP.",
  },
  {
    value: "item-4",
    question: "What types of gift cards do you accept?",
    answer:
      "We accept a wide range of gift cards, including popular retailers and online stores. Check our list of accepted gift cards on the web app.",
  },
  {
    value: "item-trust",
    question: "How can I trust you?",
    answer:
      "We have been conducting our business legitimately for years and are registered with the Corporate Affairs Commission (CAC) under Registration Number: 1945065.",
  },
  {
    value: "item-5",
    question: "How long does payments take?",
    answer:
      "Payments are typically processed Immediately after confirming your assets",
  },
  {
    value: "item-6",
    question: "What are your customer support hours?",
    answer:
      "Our customer support team is available 24/7 to assist you. You can send us an email via help@greatexchange.co or call us on +234 701 066 2232",
  },
];

const FAQs = () => {
  return (
    <div className="container py-24 bg-pink-50/70">
      <div className="dark:text-white font-semibold text-xl mb-8">
        <h4>Frequently Asked Questions</h4>
      </div>
      <div className="w-full md:w-3/6 mx-auto">
        <Accordion type="single" collapsible className="gap-4 grid">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="border border-black/10 rounded-xl px-4 drop-shadow-lg hover:drop-shadow-sm duration-300 bg-gradient-to-b from-pink-50 to-purple-100/80 hover:decoration-transparent shadow-pink-800/30 shadow-sm py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-left dark:text-neutral-400 text-black/60 p-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQs;
