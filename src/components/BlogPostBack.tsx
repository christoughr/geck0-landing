"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function BlogPostBack() {
  const { t } = useI18n();
  return (
    <Link
      href="/blog"
      className="text-sm text-purple-400 hover:text-purple-300 mb-8 inline-block"
    >
      {t.blog.back}
    </Link>
  );
}
