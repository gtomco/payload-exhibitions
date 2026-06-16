'use client'

import type { TextFieldClientProps } from 'payload'

import { FieldLabel, useField } from '@payloadcms/ui'
import React from 'react'

const HEX_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export const ColorPickerField: React.FC<TextFieldClientProps> = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })

  const label = typeof field?.label === 'string' ? field.label : undefined
  const stringValue = typeof value === 'string' ? value : ''
  const swatchValue = HEX_REGEX.test(stringValue) ? stringValue : '#000000'

  return (
    <div className="field-type text">
      <FieldLabel label={label} path={path} />
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <input
          aria-label={`${label || 'Color'} swatch`}
          onChange={(e) => setValue(e.target.value)}
          style={{
            background: 'none',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
            height: '40px',
            padding: 0,
            width: '48px',
          }}
          type="color"
          value={swatchValue}
        />
        <input
          className="field-type__wrap"
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000 — leave blank to use theme default"
          style={{
            flex: 1,
            height: '40px',
            padding: '0 0.75rem',
          }}
          type="text"
          value={stringValue}
        />
        {stringValue ? (
          <button
            onClick={() => setValue('')}
            style={{
              background: 'none',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              cursor: 'pointer',
              height: '40px',
              padding: '0 0.75rem',
            }}
            type="button"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}
