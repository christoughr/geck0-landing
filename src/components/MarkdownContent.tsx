import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-white mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-white/65 leading-relaxed mb-4">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-white/65">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  hr: () => <hr className="border-navy-600/40 my-8" />,
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="text-white/50 not-italic text-sm">{children}</em>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-purple-400 hover:text-purple-300 underline">
      {children}
    </a>
  ),
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
