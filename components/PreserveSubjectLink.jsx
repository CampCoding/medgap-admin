"use client";

import React from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";

export default function PreserveSubjectLink({ href, children, ...props }) {
  const searchParams = useSearchParams();
  const subject = searchParams?.get("subject");

  let finalHref = href;

  if (typeof href === "string") {
    // Build URL safely without a real origin
    const url = new URL(href, "http://local");
    if (subject) url.searchParams.set("subject", subject);
    finalHref = url.pathname + url.search;
  } else if (href && typeof href === "object") {
    finalHref = {
      ...href,
      query: {
        ...(href.query || {}),
        ...(subject ? { subject } : {}),
      },
    };
  }

  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}
