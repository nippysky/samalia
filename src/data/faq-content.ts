// src/data/faq-content.ts
export type FAQItem = {
  id: string;
  question: string;
  answer: string[];
  bullets?: string[];
};

export type FAQSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: FAQItem[];
};

export const faqSections: FAQSection[] = [
  {
    id: "orders",
    eyebrow: "01",
    title: "Orders",
    description:
      "How Sam’Alia orders are placed, confirmed, modified, and prepared.",
    items: [
      {
        id: "how-to-order",
        question: "How do I place an order?",
        answer: [
          "Choose a piece from Ready to Wear, select your preferred size and colour where available, then add it to your cart. From checkout, you will provide contact and delivery details before completing payment.",
          "For production, the checkout flow will create a server-side order, initialize Paystack payment, verify the transaction, and then prepare the shipment record.",
        ],
      },
      {
        id: "order-confirmation",
        question: "Will I receive an order confirmation?",
        answer: [
          "Yes. After a successful payment verification, you should receive an order confirmation by email with your order reference, selected items, delivery information, and payment summary.",
          "During development, this flow is mocked. In production, confirmation should only be sent after Paystack verification succeeds.",
        ],
      },
      {
        id: "modify-order",
        question: "Can I cancel or modify my order?",
        answer: [
          "Orders can only be modified before they enter processing. Once a piece has been packed, dispatched, or assigned to a courier, changes may no longer be possible.",
          "For urgent corrections, contact Sam’Alia as soon as possible with your order reference.",
        ],
      },
      {
        id: "pre-order",
        question: "Will Sam’Alia support pre-orders?",
        answer: [
          "Yes. Some future pieces may be available as pre-order or made-to-order items. When that happens, the product page will clearly show the expected production and dispatch window.",
          "If an order contains both available and pre-order pieces, delivery may be split depending on fulfilment timing.",
        ],
      },
    ],
  },
  {
    id: "payments",
    eyebrow: "02",
    title: "Payments",
    description:
      "Paystack-ready payment support for card, transfer, and bank channels.",
    items: [
      {
        id: "payment-methods",
        question: "Which payment methods can I use?",
        answer: [
          "Sam’Alia is being structured around Paystack for Nigerian Naira payments. In production, supported channels may include card, bank transfer, USSD, bank payment, or other Paystack-enabled methods depending on account configuration.",
        ],
      },
      {
        id: "payment-charge",
        question: "When will I be charged?",
        answer: [
          "For standard ready-to-wear orders, payment is expected during checkout. The backend should verify the Paystack transaction before the order is marked as paid.",
          "For future bespoke or made-to-order workflows, Sam’Alia may support deposits, staged payments, or final balance payments depending on the service.",
        ],
      },
      {
        id: "declined-payment",
        question: "What should I do if my payment fails?",
        answer: [
          "Check that your payment details are correct, your bank or card is active, and your account has enough funds. If Paystack returns a failed transaction, no order should be marked as paid until verification succeeds.",
          "If funds were debited but the order was not confirmed, contact Sam’Alia with your payment reference so the transaction can be reviewed.",
        ],
      },
      {
        id: "currency",
        question: "Which currency does Sam’Alia use?",
        answer: [
          "The current checkout is structured for Nigerian Naira. Prices, delivery estimates, and Paystack payment amounts are displayed in ₦.",
        ],
      },
    ],
  },
  {
    id: "delivery",
    eyebrow: "03",
    title: "Delivery",
    description:
      "Nigeria-first shipping with a structure ready for Shipbubble integration.",
    items: [
      {
        id: "delivery-provider",
        question: "How will my order be delivered?",
        answer: [
          "Sam’Alia is being prepared for Shipbubble-powered delivery. In production, Shipbubble can be used to fetch delivery rates, courier options, pickup details, and tracking information.",
        ],
      },
      {
        id: "delivery-fee",
        question: "How is the delivery fee calculated?",
        answer: [
          "In development, delivery fees are estimated based on state and order subtotal. In production, Shipbubble should return real courier rates based on pickup address, customer address, package weight, dimensions, and courier availability.",
        ],
      },
      {
        id: "delivery-time",
        question: "How long will delivery take?",
        answer: [
          "Delivery time depends on the destination, courier, and order processing status. Lagos deliveries may be faster, while nationwide deliveries may take longer.",
          "The checkout page already includes an estimated arrival field so it can later display courier-backed Shipbubble ETA data.",
        ],
      },
      {
        id: "address-change",
        question: "Can I change my delivery address after ordering?",
        answer: [
          "Address changes may only be possible before the order is assigned to a courier. Once a shipment has been booked or dispatched, the address may no longer be editable.",
        ],
      },
      {
        id: "damaged-parcel",
        question: "What should I do if my parcel arrives damaged?",
        answer: [
          "Do not discard the packaging. Take clear photos of the parcel, the shipping label, and the item condition, then contact Sam’Alia immediately with your order reference.",
          "This helps the team review the shipment and courier handoff accurately.",
        ],
      },
    ],
  },
  {
    id: "returns-exchanges",
    eyebrow: "04",
    title: "Returns & exchanges",
    description:
      "Return and exchange expectations for ready-to-wear and bespoke pieces.",
    items: [
      {
        id: "return-policy",
        question: "Can I return a ready-to-wear item?",
        answer: [
          "Ready-to-wear return eligibility should depend on the item condition, timing, hygiene requirements, and whether tags and packaging are intact.",
          "For production, Sam’Alia should define a clear return window before launch and display it on product, checkout, and shipping pages.",
        ],
      },
      {
        id: "exchange-size",
        question: "Can I exchange for another size?",
        answer: [
          "Size exchanges may be supported when the requested size is available and the returned item meets the required condition.",
          "If an item is limited, sold out, or made in small quantities, exchange availability may be restricted.",
        ],
      },
      {
        id: "bespoke-returns",
        question: "Can bespoke or personalised pieces be returned?",
        answer: [
          "Bespoke, altered, personalised, or made-to-order pieces are usually not eligible for standard returns because they are prepared for a specific client.",
          "If a production issue occurs, Sam’Alia should review the case directly and propose the appropriate correction.",
        ],
      },
      {
        id: "refund-time",
        question: "How long do refunds take?",
        answer: [
          "Refund timelines depend on order review, item inspection, and payment provider processing. Once approved, the refund should be processed back through the original payment channel where possible.",
        ],
      },
    ],
  },
  {
    id: "sizing-fit",
    eyebrow: "05",
    title: "Sizing & fit",
    description:
      "Guidance for choosing sizes, measurements, and fit expectations.",
    items: [
      {
        id: "find-size",
        question: "How do I find my size?",
        answer: [
          "Use the size guide on product pages where available. For now, Sam’Alia should keep sizing simple and consistent across ready-to-wear categories.",
          "If you are between sizes or buying a structured piece, contact the studio before ordering.",
        ],
      },
      {
        id: "measurements",
        question: "Can I submit my measurements?",
        answer: [
          "For bespoke services and private appointments, measurements may be collected before or during consultation. Ready-to-wear orders should use standard size options unless a product clearly supports alteration.",
        ],
      },
      {
        id: "fit-advice",
        question: "Can Sam’Alia advise on fit?",
        answer: [
          "Yes. The appointment flow can support fit guidance, occasion dressing, and service notes so the team can recommend the right piece or service.",
        ],
      },
    ],
  },
  {
    id: "bespoke-appointments",
    eyebrow: "06",
    title: "Bespoke & appointments",
    description:
      "Private service, personalisation, consultation, and studio support.",
    items: [
      {
        id: "book-appointment",
        question: "How do I book an appointment?",
        answer: [
          "Use the appointment page to submit your preferred date, time, reason for visit, and contact details. The team can then confirm availability and next steps.",
        ],
      },
      {
        id: "appointment-location",
        question: "Where are appointments held?",
        answer: [
          "Sam’Alia is currently structured as Nigeria-first, with Lagos as the primary appointment context. The location and meeting format should be confirmed after the request is reviewed.",
        ],
      },
      {
        id: "personalisation",
        question: "Does Sam’Alia offer personalisation?",
        answer: [
          "Personalisation can be offered selectively depending on the garment, fabric, production timeline, and design language. The service should remain restrained and aligned with the house aesthetic.",
        ],
      },
      {
        id: "appointment-cost",
        question: "Is there a fee for appointments?",
        answer: [
          "Appointment fees, deposits, or consultation requirements can be introduced later depending on the service type. The page is already structured so production rules can be added cleanly.",
        ],
      },
    ],
  },
  {
    id: "gifting-care",
    eyebrow: "07",
    title: "Gifting & care",
    description:
      "Packaging, gift notes, garment care, and long-term ownership.",
    items: [
      {
        id: "gift-option",
        question: "Can I send an order as a gift?",
        answer: [
          "Yes. Sam’Alia can support a gift option in checkout, including a gift note and refined packaging rules. In production, the gift option should also hide pricing from the recipient-facing insert where required.",
        ],
      },
      {
        id: "care-instructions",
        question: "How should I care for my Sam’Alia piece?",
        answer: [
          "Care instructions should be shown on the product page and included with the garment where possible. Structured, delicate, embroidered, or embellished pieces may require specialist cleaning.",
        ],
      },
      {
        id: "craft-support",
        question: "Does Sam’Alia offer craft or repair support?",
        answer: [
          "The house can later introduce care review or repair support for selected pieces. For now, customers should contact the studio with photos and order details if a piece needs attention.",
        ],
      },
    ],
  },
];

export const faqFlatItems = faqSections.flatMap((section) => section.items);