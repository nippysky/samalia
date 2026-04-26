// src/components/checkout/checkout-content.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShield,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import { BrandButton } from "@/src/components/ui/brand-button";
import {
  formatCartAmount,
  getCartItemCount,
  getCartSubtotal,
  type CartItem,
  useCartStore,
} from "@/src/stores/cart-store";
import { useBrandToastStore } from "@/src/stores/brand-toast-store";

type DeliveryCountry = "Nigeria";

type CheckoutFormState = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: DeliveryCountry;
  state: string;
  city: string;
  address: string;
  deliveryNote: string;
};

type DeliveryEstimate = {
  fee: number;
  eta: string;
  courierLabel: string;
  integrationProvider: "shipbubble";
};

const initialFormState: CheckoutFormState = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  country: "Nigeria",
  state: "",
  city: "",
  address: "",
  deliveryNote: "",
};

const nigerianStates = [
  "Lagos",
  "Abuja FCT",
  "Oyo",
  "Rivers",
  "Kano",
  "Kaduna",
  "Ogun",
  "Enugu",
  "Anambra",
  "Edo",
  "Delta",
  "Kwara",
  "Plateau",
  "Akwa Ibom",
  "Other",
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getDeliveryEstimate({
  subtotal,
  state,
  city,
}: {
  subtotal: number;
  state: string;
  city: string;
}): DeliveryEstimate {
  const normalizedState = state.trim().toLowerCase();
  const normalizedCity = city.trim().toLowerCase();

  if (subtotal <= 0) {
    return {
      fee: 0,
      eta: "Add items to see delivery estimate",
      courierLabel: "Shipbubble delivery",
      integrationProvider: "shipbubble",
    };
  }

  if (subtotal >= 1_500_000) {
    return {
      fee: 0,
      eta: "2–5 business days",
      courierLabel: "Complimentary Shipbubble delivery",
      integrationProvider: "shipbubble",
    };
  }

  if (normalizedState.includes("lagos")) {
    return {
      fee: 4_500,
      eta: normalizedCity.includes("island")
        ? "1–2 business days"
        : "2–3 business days",
      courierLabel: "Lagos courier via Shipbubble",
      integrationProvider: "shipbubble",
    };
  }

  if (normalizedState.includes("abuja")) {
    return {
      fee: 7_500,
      eta: "2–4 business days",
      courierLabel: "Abuja courier via Shipbubble",
      integrationProvider: "shipbubble",
    };
  }

  if (normalizedState.length > 0) {
    return {
      fee: 9_500,
      eta: "3–6 business days",
      courierLabel: "Nationwide courier via Shipbubble",
      integrationProvider: "shipbubble",
    };
  }

  return {
    fee: 0,
    eta: "Enter delivery state to estimate",
    courierLabel: "Shipbubble delivery estimate",
    integrationProvider: "shipbubble",
  };
}

function validateCheckoutForm(form: CheckoutFormState, itemCount: number) {
  const errors: Partial<Record<keyof CheckoutFormState, string>> = {};

  if (itemCount <= 0) {
    errors.email = "Your cart is empty.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!form.state.trim()) {
    errors.state = "State is required.";
  }

  if (!form.city.trim()) {
    errors.city = "City is required.";
  }

  if (!form.address.trim()) {
    errors.address = "Delivery address is required.";
  }

  return errors;
}

export function CheckoutContent() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const pushToast = useBrandToastStore((state) => state.pushToast);

  const [form, setForm] = React.useState<CheckoutFormState>(initialFormState);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CheckoutFormState, string>>
  >({});

  const itemCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);

  const delivery = React.useMemo(
    () =>
      getDeliveryEstimate({
        subtotal,
        state: form.state,
        city: form.city,
      }),
    [form.city, form.state, subtotal]
  );

  const total = subtotal + delivery.fee;
  const hasItems = items.length > 0;

  function updateField<Key extends keyof CheckoutFormState>(
    key: Key,
    value: CheckoutFormState[Key]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(form, itemCount);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      pushToast({
        variant: "error",
        title: "Checkout needs attention",
        message: "Please complete the required delivery and contact fields.",
      });

      return;
    }

    setSubmitting(true);

    const checkoutPayload = {
      customer: {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      },
      delivery: {
        provider: "shipbubble",
        country: form.country,
        state: form.state,
        city: form.city.trim(),
        address: form.address.trim(),
        note: form.deliveryNote.trim(),
        estimatedFee: delivery.fee,
        estimatedEta: delivery.eta,
      },
      payment: {
        provider: "paystack",
        currency: "NGN",
        amount: total,
      },
      items: items.map((item) => ({
        cartItemId: item.id,
        productSlug: item.productSlug,
        productName: item.productName,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitAmount: item.price.amount,
        lineAmount: item.price.amount * item.quantity,
      })),
      subtotal,
      total,
    };

    console.info("Sam’Alia checkout payload", checkoutPayload);

    await new Promise((resolve) => window.setTimeout(resolve, 650));

    setSubmitting(false);

    pushToast({
      variant: "success",
      title: "Payment initialized",
      message:
        "This checkout is ready for Paystack initialization and Shipbubble rate booking.",
    });
  }

  function handleMockSuccessfulPayment() {
    clearCart();

    pushToast({
      variant: "success",
      title: "Order received",
      message:
        "Your Sam’Alia order has been captured. Production will replace this with Paystack verification.",
    });
  }

  return (
    <main className="lux-page bg-white text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto w-full max-w-440 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 2xl:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-170">
              <Link
                href="/ready-to-wear"
                className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45 transition-colors duration-300 ease-luxury hover:text-black"
              >
                <FiArrowLeft className="size-3.5" />
                Continue shopping
              </Link>

              <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
                Secure checkout
              </p>

              <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,6.4rem)] font-medium leading-[0.94] tracking-tight text-black">
                Delivery and payment.
              </h1>

              <p className="mt-6 max-w-130 text-sm leading-8 text-black/58 sm:text-base">
                Complete your order with Nigeria-first delivery support and a
                Paystack-ready payment flow.
              </p>
            </div>

            <div className="grid gap-3 text-[10px] uppercase tracking-[0.22em] text-black/48 sm:grid-cols-2 lg:min-w-120">
              <div className="border border-black/10 p-4">
                <div className="mb-4 flex size-9 items-center justify-center border border-black/10 text-black">
                  <FiShield className="size-4" />
                </div>
                Paystack-ready secure payment
              </div>

              <div className="border border-black/10 p-4">
                <div className="mb-4 flex size-9 items-center justify-center border border-black/10 text-black">
                  <FiTruck className="size-4" />
                </div>
                Shipbubble-ready delivery estimate
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasItems ? (
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="mx-auto grid w-full max-w-440 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.48fr)] lg:gap-14 lg:px-8 lg:py-18 2xl:px-10">
            <div className="min-w-0 space-y-10">
              <CheckoutPanel
                eyebrow="Contact"
                title="Customer information"
                description="Your receipt and delivery updates will be sent to this contact."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <CheckoutField
                    label="Email address"
                    error={errors.email}
                    className="sm:col-span-2"
                  >
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="lux-field"
                    />
                  </CheckoutField>

                  <CheckoutField label="First name" error={errors.firstName}>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                      placeholder="First name"
                      autoComplete="given-name"
                      className="lux-field"
                    />
                  </CheckoutField>

                  <CheckoutField label="Last name" error={errors.lastName}>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                      placeholder="Last name"
                      autoComplete="family-name"
                      className="lux-field"
                    />
                  </CheckoutField>

                  <CheckoutField
                    label="Phone number"
                    error={errors.phone}
                    className="sm:col-span-2"
                  >
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="+234"
                      autoComplete="tel"
                      className="lux-field"
                    />
                  </CheckoutField>
                </div>
              </CheckoutPanel>

              <CheckoutPanel
                eyebrow="Delivery"
                title="Shipping information"
                description="This structure mirrors the delivery payload Shipbubble will need in production."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <CheckoutField label="Country">
                    <select
                      value={form.country}
                      onChange={(event) =>
                        updateField(
                          "country",
                          event.target.value as DeliveryCountry
                        )
                      }
                      className="lux-field"
                    >
                      <option value="Nigeria">Nigeria</option>
                    </select>
                  </CheckoutField>

                  <CheckoutField label="State" error={errors.state}>
                    <select
                      value={form.state}
                      onChange={(event) =>
                        updateField("state", event.target.value)
                      }
                      className="lux-field"
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </CheckoutField>

                  <CheckoutField label="City / Area" error={errors.city}>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      placeholder="Ikoyi, Abuja, Ibadan..."
                      autoComplete="address-level2"
                      className="lux-field"
                    />
                  </CheckoutField>

                  <CheckoutField
                    label="Full delivery address"
                    error={errors.address}
                    className="sm:col-span-2"
                  >
                    <textarea
                      value={form.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      placeholder="House number, street, estate, landmark..."
                      autoComplete="street-address"
                      className="lux-field min-h-32 resize-none"
                    />
                  </CheckoutField>

                  <CheckoutField
                    label="Delivery note"
                    className="sm:col-span-2"
                  >
                    <textarea
                      value={form.deliveryNote}
                      onChange={(event) =>
                        updateField("deliveryNote", event.target.value)
                      }
                      placeholder="Optional note for courier or Sam’Alia studio."
                      className="lux-field min-h-28 resize-none"
                    />
                  </CheckoutField>
                </div>
              </CheckoutPanel>

              <CheckoutPanel
                eyebrow="Payment"
                title="Paystack payment"
                description="Production will initialize a Paystack transaction server-side, verify payment, then create the Shipbubble shipment."
              >
                <div className="grid gap-4 border border-black/10 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
                  <div className="flex size-10 items-center justify-center border border-black/10">
                    <FiCheck className="size-4 text-black" />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black">
                      Pay with card, transfer, or bank
                    </p>

                    <p className="mt-3 text-sm leading-7 text-black/55">
                      Amount will be charged in Nigerian Naira through Paystack.
                      Backend verification should be the source of truth before
                      marking the order as paid.
                    </p>
                  </div>
                </div>
              </CheckoutPanel>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
              <CheckoutSummary
                items={items}
                subtotal={subtotal}
                delivery={delivery}
                total={total}
                itemCount={itemCount}
                submitting={submitting}
                onMockSuccessfulPayment={handleMockSuccessfulPayment}
              />
            </aside>
          </div>
        </form>
      ) : (
        <EmptyCheckout />
      )}
    </main>
  );
}

function CheckoutPanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="border-b border-black/10 p-5 sm:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-[1.1rem] font-medium tracking-tight text-black">
          {title}
        </h2>

        <p className="mt-3 max-w-150 text-sm leading-7 text-black/55">
          {description}
        </p>
      </div>

      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}

function CheckoutField({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-black/45">
        {label}
      </span>

      {children}

      {error ? (
        <span className="mt-2 block text-[11px] leading-5 text-black">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function CheckoutSummary({
  items,
  subtotal,
  delivery,
  total,
  itemCount,
  submitting,
  onMockSuccessfulPayment,
}: {
  items: CartItem[];
  subtotal: number;
  delivery: DeliveryEstimate;
  total: number;
  itemCount: number;
  submitting: boolean;
  onMockSuccessfulPayment: () => void;
}) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="border-b border-black/10 p-5 sm:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
          Order summary
        </p>

        <div className="mt-3 flex items-end justify-between gap-5">
          <h2 className="text-[1.1rem] font-medium tracking-tight text-black">
            {itemCount} selected item{itemCount === 1 ? "" : "s"}
          </h2>

          <Link
            href="/ready-to-wear"
            className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/42 transition-colors duration-300 ease-luxury hover:text-black"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="max-h-[46svh] overflow-y-auto overscroll-contain p-5 [-webkit-overflow-scrolling:touch] sm:p-7 lg:max-h-[42svh]">
        <div className="space-y-4">
          {items.map((item) => (
            <CheckoutLineItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="border-t border-black/10 p-5 sm:p-7">
        <div className="space-y-4 text-sm">
          <SummaryRow label="Subtotal" value={formatCartAmount(subtotal)} />

          <SummaryRow
            label="Delivery"
            value={
              delivery.fee > 0 ? formatCartAmount(delivery.fee) : "Estimated"
            }
          />

          <div className="border border-black/10 p-4">
            <div className="flex items-start gap-3">
              <FiTruck className="mt-0.5 size-4 shrink-0 text-black/55" />

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">
                  {delivery.courierLabel}
                </p>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  Estimated arrival: {delivery.eta}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-black/10" />

          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-black/42">
                Total
              </p>

              <p className="mt-2 text-[11px] leading-5 text-black/45">
                Includes estimated delivery where available.
              </p>
            </div>

            <p className="text-xl font-medium tracking-tight text-black">
              {formatCartAmount(total)}
            </p>
          </div>
        </div>

        <BrandButton
          type="submit"
          fullWidth
          size="lg"
          variant="primary"
          loading={submitting}
          className="mt-6"
          iconAfter={<FiArrowRight className="size-4" />}
        >
          Pay {formatCartAmount(total)}
        </BrandButton>

        <button
          type="button"
          onClick={onMockSuccessfulPayment}
          className="mt-4 w-full text-center text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 transition-colors duration-300 ease-luxury hover:text-black"
        >
          Dev: mark payment successful
        </button>
      </div>
    </section>
  );
}

function CheckoutLineItem({ item }: { item: CartItem }) {
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const pushToast = useBrandToastStore((state) => state.pushToast);

  function handleRemove() {
    removeItem(item.id);

    pushToast({
      variant: "success",
      title: "Removed from checkout",
      message: `${item.productName} has been removed from your order.`,
    });
  }

  return (
    <article className="grid grid-cols-[82px_minmax(0,1fr)] gap-4">
      <Link
        href={`/shop/${item.productSlug}`}
        className="relative block aspect-3/4 overflow-hidden bg-black/5"
        aria-label={item.productName}
      >
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="82px"
            className="object-cover transition-transform duration-700 ease-luxury hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <HiOutlineShoppingBag className="size-5 text-black/30" />
          </div>
        )}
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${item.productSlug}`}
              className="block truncate text-[11px] font-medium uppercase tracking-[0.18em] text-black transition-colors duration-300 ease-luxury hover:text-black/55"
            >
              {item.productName}
            </Link>

            <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-black/42">
              {item.color} / {item.size}
            </p>
          </div>

          <button
            type="button"
            aria-label={`Remove ${item.productName}`}
            onClick={handleRemove}
            className="flex size-8 shrink-0 items-center justify-center text-black/35 transition-colors duration-300 ease-luxury hover:text-black"
          >
            <FiTrash2 className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex h-9 items-center border border-black/10">
            <button
              type="button"
              aria-label={`Decrease ${item.productName} quantity`}
              onClick={() => decrementItem(item.id)}
              className="flex size-9 items-center justify-center text-black/55 transition-colors duration-300 hover:text-black"
            >
              <FiMinus className="size-3.5" />
            </button>

            <span className="flex h-9 min-w-8 items-center justify-center text-[11px] font-medium text-black">
              {item.quantity}
            </span>

            <button
              type="button"
              aria-label={`Increase ${item.productName} quantity`}
              onClick={() => incrementItem(item.id)}
              className="flex size-9 items-center justify-center text-black/55 transition-colors duration-300 hover:text-black"
            >
              <FiPlus className="size-3.5" />
            </button>
          </div>

          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black">
            {formatCartAmount(item.price.amount * item.quantity)}
          </p>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 text-[11px] uppercase tracking-[0.18em] text-black/50">
      <span>{label}</span>
      <span className="text-black">{value}</span>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto flex min-h-[calc(74svh-var(--nav-h))] w-full max-w-440 items-center justify-center px-4 py-16 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto max-w-110 text-center">
          <div className="mx-auto flex size-16 items-center justify-center border border-black/10">
            <HiOutlineShoppingBag className="size-7 text-black" />
          </div>

          <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
            Empty checkout
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-none tracking-tight text-black">
            Your cart is empty.
          </h1>

          <p className="mx-auto mt-5 max-w-90 text-sm leading-8 text-black/55">
            Add a Sam’Alia piece to your cart before continuing to checkout.
          </p>

          <div className="mt-8">
            <BrandButton
              href="/ready-to-wear"
              variant="primary"
              iconAfter={<FiArrowRight className="size-4" />}
            >
              Shop ready to wear
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}