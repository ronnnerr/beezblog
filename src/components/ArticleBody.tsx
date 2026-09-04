import type { ArticleBlock, ArticleInline } from '../content/articles'

interface ArticleBodyProps {
  blocks: ArticleBlock[]
}

function InlineContent({ run, index }: { run: ArticleInline; index: number }) {
  const text = run.bold ? <strong>{run.text}</strong> : run.text

  if (run.href) {
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

        return <p key={blockIndex}>{content}</p>
      })}
    </div>
  )
}
