"use client";

import React from "react";

const HowGiftListWorksSection = () => {
  const steps = [
    {
      title: "Βήμα 1",
      description: "Smart filtering and suggestions make it easy to find",
      image: "/images/step1.png", // replace with your actual icons
    },
    {
      title: "Βήμα 2",
      description: "Easily select the correct items and add them to the cart",
      image: "/images/step2.png",
    },
    {
      title: "Βήμα 3",
      description: "The carrier will confirm and ship quickly to you",
      image: "/images/step3.png",
    },
  ];

  return (
    <div className="w-full bg-[#F8F8F8] py-32 px-6 lg:px-28">
      <h2 className="text-center text-[#063B67] font-serif text-3xl  mb-16">
        Πώς λειτουργεί η λίστα δώρων
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={step.image}
              alt={step.title}
              className="h-24 w-24 object-contain"
            />
            <h3 className="text-[#063B67]  text-lg">{step.title}</h3>
            <p className="text-gray-600 text-sm max-w-[250px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowGiftListWorksSection;
