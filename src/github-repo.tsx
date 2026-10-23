"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";

type Repository = {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
};

const repositories = new Map<string, Promise<Repository>>();
function loadRepository(slug: string) {
  const cached = repositories.get(slug);
  if (cached) return cached;
  const request = fetch(`https://api.github.com/repos/${slug}`, {
    headers: { Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(8000),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("Repository unavailable");
      const data = await response.json();
      if (
        typeof data.stargazers_count !== "number" ||
        typeof data.forks_count !== "number"
      )
        throw new Error("Invalid repository response");
      return {
        description:
          typeof data.description === "string" ? data.description : null,
        stargazers_count: data.stargazers_count,
        forks_count: data.forks_count,
      };
    })
    .catch((error: unknown) => {
      repositories.delete(slug);
      throw error;
    });
  repositories.set(slug, request);
  return request;
}

export function GitHubRepo({
  repo,
  variant = "inset",
  className = "",
}: {
  repo: string;
  variant?: "inset" | "flat";
  className?: string;
}) {
  const slug = repo
    .trim()
    .replace(/^https:\/\/github\.com\//i, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "")
    .replace(/\.git$/, "");
  if (!/^[\w.-]+\/[\w.-]+$/.test(slug)) return null;
  return (
    <RepositoryCard
      key={slug}
      slug={slug}
      variant={variant}
      className={className}
    />
  );
}

function RepositoryCard({
  slug,
  variant,
  className,
}: {
  slug: string;
  variant: "inset" | "flat";
  className: string;
}) {
  const [state, setState] = useState<{
    loading: boolean;
    data: Repository | null;
  }>({ loading: true, data: null });
  useEffect(() => {
    let active = true;
    loadRepository(slug).then(
      (data) => {
        if (active) setState({ loading: false, data });
      },
      () => {
        if (active) setState({ loading: false, data: null });
      },
    );
    return () => {
      active = false;
    };
  }, [slug]);
  const formatCount = (count: number) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(count);
  return (
    <a
      className={`docs-github-repo ${className}`}
      data-variant={variant}
      href={`https://github.com/${slug}`}
    >
      <div className="docs-github-info">
        <span className="docs-github-name">
          <Github size={20} aria-hidden="true" />
          <span>{slug}</span>
        </span>
        {state.data?.description && (
          <span className="docs-github-description">
            {state.data.description}
          </span>
        )}
        {state.loading && (
          <span className="docs-github-skeleton" aria-hidden="true" />
        )}
      </div>
      <div className="docs-github-stats" aria-busy={state.loading}>
        {state.data ? (
          <>
            <span aria-label={`${state.data.stargazers_count} stars`}>
              <Star size={16} aria-hidden="true" />
              {formatCount(state.data.stargazers_count)}
            </span>
            <span aria-label={`${state.data.forks_count} forks`}>
              <GitFork size={16} aria-hidden="true" />
              {formatCount(state.data.forks_count)}
            </span>
          </>
        ) : state.loading ? (
          <span aria-label="加载仓库信息">
            <span className="docs-github-skeleton" aria-hidden="true" />
          </span>
        ) : (
          <span>
            GitHub <ArrowUpRight size={14} aria-hidden="true" />
          </span>
        )}
      </div>
    </a>
  );
}
