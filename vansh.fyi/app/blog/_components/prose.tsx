import type { Components } from 'react-markdown';

/**
 * Typography for rendered Markdown, shared by the public post page (server) and the admin editor
 * preview (client). No server-only imports here, so both can use it.
 */
export const proseComponents: Components = {
  h2: ({ node: _node, ...props }) => <h2 className="mt-14 mb-4 scroll-mt-28 text-2xl font-light tracking-tighter font-geist text-white sm:text-3xl" {...props} />,
  h3: ({ node: _node, ...props }) => <h3 className="mt-10 mb-3 scroll-mt-28 text-xl font-medium tracking-tight font-geist text-white" {...props} />,
  h4: ({ node: _node, ...props }) => <h4 className="mt-8 mb-2 scroll-mt-28 text-lg font-medium font-geist text-white" {...props} />,
  p: ({ node: _node, ...props }) => <p className="my-5 leading-relaxed text-white/80" {...props} />,
  a: ({ node: _node, href, ...props }) => {
    const external = !!href && /^https?:\/\//.test(href);
    return <a href={href} className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props} />;
  },
  ul: ({ node: _node, ...props }) => <ul className="my-5 list-disc space-y-2 pl-6 text-white/80 marker:text-white/30" {...props} />,
  ol: ({ node: _node, ...props }) => <ol className="my-5 list-decimal space-y-2 pl-6 text-white/80 marker:text-white/50" {...props} />,
  blockquote: ({ node: _node, ...props }) => <blockquote className="my-8 border-l-2 border-white/20 pl-5 italic text-white/80" {...props} />,
  hr: () => <hr className="my-12 border-white/10" />,
  table: ({ node: _node, ...props }) => (
    <div className="my-8 overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table className="w-full text-left text-sm text-white/80" {...props} />
    </div>
  ),
  th: ({ node: _node, ...props }) => <th className="border-b border-white/10 bg-white/5 px-4 py-2 font-medium text-white" {...props} />,
  td: ({ node: _node, ...props }) => <td className="border-b border-white/5 px-4 py-2" {...props} />,
  pre: ({ node: _node, className, ...props }) => (
    <pre className={`${className ?? ''} my-6 overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-relaxed ring-1 ring-white/10`} {...props} />
  ),
  code: ({ node: _node, className, ...props }) =>
    className ? <code className={className} {...props} /> : <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-white" {...props} />,
};
