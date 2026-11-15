import { Fragment, type ReactNode } from 'react'
import { CopyButton } from './ui'

// A tiny Swift highlighter: enough to make excerpts readable, with no dependency.
const KEYWORDS = new Set(
  (
    'actor as associatedtype async await break case catch class continue default defer do else enum extension fallthrough false fileprivate final for func get guard if import in init inout internal is lazy let mutating nil nonisolated open operator private protocol public repeat rethrows return self Self set some static struct subscript super switch throw throws true try typealias var weak where while any didSet willSet'
  ).split(' '),
)

const TOKEN = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|([@#]?\b[A-Za-z_]\w*\b)|(\b\d[\d_]*(?:\.\d+)?\b)/g

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of code.matchAll(TOKEN)) {
    const [text, comment, string, word, number] = m
    const at = m.index ?? 0
    if (at > last) out.push(code.slice(last, at))
    let cls = ''
    if (comment) cls = text.trim() === '// …' ? 'tok-ellipsis' : 'tok-comment'
    else if (string) cls = 'tok-string'
    else if (word) {
      if (word.startsWith('@') || word.startsWith('#')) cls = 'tok-attr'
      else if (code[at - 1] === '.') cls = 'tok-member'
      else if (KEYWORDS.has(word)) cls = 'tok-keyword'
      else if (/^[A-Z]/.test(word)) cls = 'tok-type'
    } else if (number) cls = 'tok-number'
    out.push(cls ? <span key={i++} className={cls}>{text}</span> : <Fragment key={i++}>{text}</Fragment>)
    last = at + text.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, file, href, lines }: { code: string; file?: string; href?: string; lines?: string }) {
  return (
    <figure className="code-block">
      {(file || href) && (
        <figcaption className="code-block-head">
          <span className="code-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="code-file">
            {file}
            {lines && <span className="muted"> · {lines}</span>}
          </span>
          {href && (
            <a className="code-source" href={href} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          )}
          <CopyButton text={code} />
        </figcaption>
      )}
      <pre>
        <code>{highlight(code)}</code>
      </pre>
    </figure>
  )
}

/** Renders `code` spans and **bold** in short data strings. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="inline-code">
            {part.slice(1, -1)}
          </code>
        ) : part.startsWith('**') && part.endsWith('**') ? (
          <b key={i}>{part.slice(2, -2)}</b>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
