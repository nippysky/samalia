// app/journal/[journalSlug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JournalArticlePage } from "@/src/components/journal/journal-article-page";
import {
  getJournalArticleBySlug,
  getJournalArticleSlugs,
} from "@/src/data/journal-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

type JournalArticleRouteProps = {
  params: Promise<{
    journalSlug: string;
  }>;
};

function getAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateStaticParams() {
  return getJournalArticleSlugs();
}

export async function generateMetadata({
  params,
}: JournalArticleRouteProps): Promise<Metadata> {
  const { journalSlug } = await params;
  const article = await getJournalArticleBySlug(journalSlug);

  if (!article) {
    return {
      title: "Journal not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/journal/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Sam’Alia`,
      description: article.excerpt,
      url: `/journal/${article.slug}`,
      siteName: "Sam’Alia",
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.heroImage.src,
          width: 1600,
          height: 1000,
          alt: article.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Sam’Alia`,
      description: article.excerpt,
      images: [article.heroImage.src],
    },
  };
}

export default async function JournalArticleRoute({
  params,
}: JournalArticleRouteProps) {
  const { journalSlug } = await params;
  const article = await getJournalArticleBySlug(journalSlug);

  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: getAbsoluteUrl(article.heroImage.src),
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Sam’Alia",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-samalia.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/journal/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(articleJsonLd),
        }}
      />

      <JournalArticlePage article={article} />
    </>
  );
}