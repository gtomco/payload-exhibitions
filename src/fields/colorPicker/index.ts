import type { Field } from 'payload'

type ColorFieldOptions = {
  label: string
  name: string
}

/**
 * A text field rendered with a native color picker + hex input in the admin UI.
 * Leave blank to fall back to the theme default defined in globals.css.
 */
export const colorField = ({ label, name }: ColorFieldOptions): Field => ({
  name,
  type: 'text',
  admin: {
    components: {
      Field: '@/fields/colorPicker/Field.client#ColorPickerField',
    },
  },
  label,
})
