import type { ArticleBlock, ArticleInline } from '../content/articles'
import { assetUrl } from '../lib/assetUrl'

interface ArticleBodyProps {
  blocks: ArticleBlock[]
}

function isSafeExternalHref(href: string): boolean {
  try {
    const { protocol } = new URL(href)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function InlineContent({ run, index }: { run: ArticleInline; index: number }) {
  const text = run.bold ? <strong>{run.text}</strong> : run.text

  if (run.href && isSafeExternalHref(run.href)) {
    return (
      <a key={index} href={run.href} target="_blank" rel="noreferrer">
        {text}
      </a>
    )
  }

  return <span key={index}>{text}</span>
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="article-body">
      {blocks.map((block, blockIndex) => {
        if (block.type === 'image') {
          return (
            <figure className="article-body__image" key={blockIndex}>
              <img src={assetUrl(block.src)} alt={block.alt} loading="lazy" />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          )
        }

        if (block.type === 'list') {
          const List = block.ordered ? 'ol' : 'ul'

          return (
            <List key={blockIndex}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.map((run, runIndex) => (
                    <InlineContent key={runIndex} run={run} index={runIndex} />
                  ))}
                </li>
              ))}
            </List>
          )
        }

        const content = block.content.map((run, runIndex) => (
          <InlineContent key={runIndex} run={run} index={runIndex} />
        ))

        if (block.type === 'heading') {
          return <h2 key={blockIndex}>{content}</h2>
        }

        if (block.type === 'quote') {
          return <blockquote key={blockIndex}>{content}</blockquote>
        }

        return <p key={blockIndex}>{content}</p>
      })}
    </div>
  )
}
