// src/components/ui/brand-button.tsx
import * as React from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";

type BrandButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "text"
  | "text-inverse"
  | "inverse";

type BrandButtonSize = "sm" | "md" | "lg" | "xl";

type SharedBrandButtonProps = {
  children: React.ReactNode;
  variant?: BrandButtonVariant;
  size?: BrandButtonSize;
  fullWidth?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  loading?: boolean;
  className?: string;
};

type BrandButtonAsButton = SharedBrandButtonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  > & {
    href?: never;
    external?: never;
  };

type BrandButtonAsLink = SharedBrandButtonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > &
  Pick<LinkProps, "href" | "replace" | "scroll" | "prefetch" | "locale"> & {
    external?: boolean;
    disabled?: boolean;
  };

export type BrandButtonProps = BrandButtonAsButton | BrandButtonAsLink;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isTextVariant(variant: BrandButtonVariant) {
  return variant === "text" || variant === "text-inverse";
}

const baseClasses =
  "group relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden font-medium uppercase transition-[background-color,border-color,color,opacity,transform] duration-300 ease-luxury focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const buttonBaseClasses = "border";

const textBaseClasses =
  "border-0 bg-transparent p-0 leading-none tracking-[0.22em]";

const sizeClasses: Record<BrandButtonSize, string> = {
  sm: "min-h-10 gap-2 px-4 text-[10px]",
  md: "min-h-12 gap-2.5 px-5 text-[11px]",
  lg: "min-h-14 gap-3 px-6 text-[11px]",
  xl: "min-h-16 gap-3.5 px-8 text-xs",
};

const textSizeClasses: Record<BrandButtonSize, string> = {
  sm: "gap-2 text-[11px]",
  md: "gap-2.5 text-xs",
  lg: "gap-3 text-[13px]",
  xl: "gap-3.5 text-sm",
};

const shellClasses: Record<BrandButtonVariant, string> = {
  primary: "border-black bg-black active:translate-y-px",
  secondary:
    "border-black/10 bg-black/[0.04] active:translate-y-px hover:border-black",
  outline: "border-black bg-transparent active:translate-y-px",
  ghost:
    "border-transparent bg-transparent active:translate-y-px hover:border-black/10 hover:bg-black/[0.04]",
  text: "text-black",
  "text-inverse": "text-white",
  inverse: "border-white bg-white active:translate-y-px",
};

const overlayClasses: Partial<Record<BrandButtonVariant, string>> = {
  primary: "bg-white",
  secondary: "bg-black",
  outline: "bg-black",
  inverse: "bg-black",
};

const contentColorClasses: Record<BrandButtonVariant, string> = {
  primary: "text-white group-hover:text-black",
  secondary: "text-black group-hover:text-white",
  outline: "text-black group-hover:text-white",
  ghost: "text-black",
  text: "text-black",
  "text-inverse": "text-white",
  inverse: "text-black group-hover:text-white",
};

function BrandButtonOverlay({ variant }: { variant: BrandButtonVariant }) {
  const overlayClassName = overlayClasses[variant];

  if (!overlayClassName) return null;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 translate-y-full transition-transform duration-300 ease-luxury group-hover:translate-y-0",
        overlayClassName
      )}
    />
  );
}

function BrandButtonContent({
  children,
  iconBefore,
  iconAfter,
  loading,
  variant,
}: Pick<
  SharedBrandButtonProps,
  "children" | "iconBefore" | "iconAfter" | "loading"
> & {
  variant: BrandButtonVariant;
}) {
  const textVariant = isTextVariant(variant);

  return (
    <span
      className={cn(
        "relative z-10 inline-flex min-w-0 max-w-full items-center justify-center gap-inherit transition-colors duration-300 ease-luxury",
        contentColorClasses[variant]
      )}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-3.5 shrink-0 animate-spin border border-current border-t-transparent"
        />
      ) : iconBefore ? (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center transition-transform duration-300 ease-luxury",
            textVariant
              ? "group-hover:-translate-x-0.5"
              : "group-hover:-translate-x-0.5"
          )}
        >
          {iconBefore}
        </span>
      ) : null}

      <span
        className={cn(
          "min-w-0 truncate whitespace-nowrap text-current",
          textVariant &&
            "relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-luxury group-hover:after:scale-x-100"
        )}
      >
        {children}
      </span>

      {!loading && iconAfter ? (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center transition-transform duration-300 ease-luxury",
            textVariant
              ? "group-hover:translate-x-1"
              : "group-hover:translate-x-0.5"
          )}
        >
          {iconAfter}
        </span>
      ) : null}
    </span>
  );
}

export const BrandButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BrandButtonProps
>(function BrandButton(props, ref) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    iconBefore,
    iconAfter,
    loading = false,
    className,
    ...rest
  } = props;

  const textVariant = isTextVariant(variant);

  const classes = cn(
    baseClasses,
    textVariant ? textBaseClasses : buttonBaseClasses,
    textVariant ? textSizeClasses[size] : sizeClasses[size],
    shellClasses[variant],
    fullWidth && !textVariant && "w-full",
    loading && "pointer-events-none",
    className
  );

  const content = (
    <>
      {!textVariant ? <BrandButtonOverlay variant={variant} /> : null}

      <BrandButtonContent
        iconBefore={iconBefore}
        iconAfter={iconAfter}
        loading={loading}
        variant={variant}
      >
        {children}
      </BrandButtonContent>
    </>
  );

  if ("href" in rest && rest.href) {
    const {
      href,
      external,
      disabled,
      replace,
      scroll,
      prefetch,
      locale,
      target,
      rel,
      ...anchorProps
    } = rest;

    const computedTarget = external ? "_blank" : target;
    const computedRel =
      external || computedTarget === "_blank"
        ? rel ?? "noopener noreferrer"
        : rel;

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        replace={replace}
        scroll={scroll}
        prefetch={prefetch}
        locale={locale}
        target={computedTarget}
        rel={computedRel}
        aria-disabled={disabled || loading ? true : undefined}
        tabIndex={disabled || loading ? -1 : anchorProps.tabIndex}
        className={classes}
        {...anchorProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled || loading}
      className={classes}
      {...buttonProps}
    >
      {content}
    </button>
  );
});