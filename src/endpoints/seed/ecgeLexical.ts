type LexicalText = {
  root: {
    type: 'root'
    children: Array<Record<string, unknown>>
    direction: 'ltr'
    format: string
    indent: number
    version: number
  }
}

function lexicalText(text: string, format = 0) {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function lexicalRoot(children: Array<Record<string, unknown>>): LexicalText {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export function lexicalParagraph(text: string): LexicalText {
  return lexicalRoot([
    {
      type: 'paragraph',
      children: [lexicalText(text)],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      version: 1,
    },
  ])
}

export function lexicalHeading(text: string, tag: 'h2' | 'h3' | 'h4' = 'h2'): LexicalText {
  return lexicalRoot([
    {
      type: 'heading',
      tag,
      children: [lexicalText(text)],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  ])
}

export function lexicalBulletList(items: string[]): LexicalText {
  return lexicalRoot([
    {
      type: 'list',
      listType: 'bullet',
      children: items.map((item) => ({
        type: 'listitem',
        children: [
          {
            type: 'paragraph',
            children: [lexicalText(item)],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        value: 1,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      listType: 'bullet',
      start: 1,
      tag: 'ul',
      version: 1,
    },
  ])
}

export function lexicalPriceCard(label: string, price: string, meta: string, features: string[]): LexicalText {
  return lexicalRoot([
    {
      type: 'heading',
      tag: 'h3',
      children: [lexicalText(label)],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
    {
      type: 'paragraph',
      children: [lexicalText(price, 1)],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      version: 1,
    },
    {
      type: 'paragraph',
      children: [lexicalText(meta, 2)],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      version: 1,
    },
    {
      type: 'list',
      listType: 'bullet',
      children: features.map((item) => ({
        type: 'listitem',
        children: [
          {
            type: 'paragraph',
            children: [lexicalText(item)],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        value: 1,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      listType: 'bullet',
      start: 1,
      tag: 'ul',
      version: 1,
    },
  ])
}

export function lexicalFaqItem(question: string, answer: string): LexicalText {
  return lexicalRoot([
    {
      type: 'heading',
      tag: 'h3',
      children: [lexicalText(question)],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
    {
      type: 'paragraph',
      children: [lexicalText(answer)],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      version: 1,
    },
  ])
}

export function contentBlock(
  columns: Array<{ size: 'full' | 'half' | 'oneThird' | 'twoThirds'; richText: LexicalText }>,
  blockName?: string,
) {
  return {
    blockType: 'content' as const,
    blockName,
    columns: columns.map((column) => ({
      size: column.size,
      richText: column.richText,
      enableLink: false,
    })),
  }
}
