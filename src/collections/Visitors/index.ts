import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { randomUUID } from 'crypto'

import { authenticated } from '../../access/authenticated'
import { micrositeField } from '../../fields/microsite'
import { micrositeBaseFilter } from '../../microsite/baseFilter'
import { defaultMicrositeFromContext } from '../../microsite/hooks/defaultMicrositeFromContext'
import { setMicrositeContext } from '../../microsite/hooks/setMicrositeContext'
import { sendVisitorTicketEmail } from '../../visitors/sendVisitorTicketEmail'

const assignTicketToken: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (!data) return data
  if (operation === 'create' && !data.ticketToken) {
    return { ...data, ticketToken: randomUUID() }
  }
  return data
}

const sendTicketEmailOnCreate: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create') return doc
  if (context?.skipVisitorEmail) return doc
  if (!doc?.email || !doc?.ticketToken) return doc

  try {
    await sendVisitorTicketEmail({
      payload: req.payload,
      visitor: doc,
      origin: typeof context?.publicOrigin === 'string' ? context.publicOrigin : undefined,
    })
    await req.payload.update({
      collection: 'visitors',
      id: doc.id,
      data: {
        emailSentAt: new Date().toISOString(),
        emailError: null,
      },
      context: { skipVisitorEmail: true },
      overrideAccess: true,
      req,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send ticket email'
    req.payload.logger.error(`Visitor ticket email failed for ${doc.id}: ${message}`)
    try {
      await req.payload.update({
        collection: 'visitors',
        id: doc.id,
        data: { emailError: message.slice(0, 500) },
        context: { skipVisitorEmail: true },
        overrideAccess: true,
        req,
      })
    } catch {
      // ignore secondary update failure
    }
  }

  return doc
}

export const Visitors: CollectionConfig = {
  slug: 'visitors',
  labels: {
    singular: 'Visitor',
    plural: 'Visitors',
  },
  access: {
    // Public creates go through POST /api/visitors — collection create stays admin-only
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    baseFilter: micrositeBaseFilter,
    defaultColumns: ['firstName', 'lastName', 'email', 'status', 'crmEventName', 'updatedAt'],
    description: 'Visitor registrations and entrance tickets for the active microsite / exhibition.',
    useAsTitle: 'email',
    group: 'Microsite',
  },
  fields: [
    micrositeField(),
    {
      name: 'crmEventId',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'CRM exhibition event snapshot at registration time.',
      },
      index: true,
    },
    {
      name: 'crmEventName',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'company', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'jobTitle', type: 'text', label: 'Job title' },
        { name: 'country', type: 'text' },
      ],
    },
    {
      name: 'ticketToken',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Opaque token used in QR codes and ticket URLs.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'registered',
      options: [
        { label: 'Registered', value: 'registered' },
        { label: 'Checked in', value: 'checked_in' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'checkedInAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
    {
      name: 'checkedInBy',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'User id or "kiosk".',
      },
    },
    {
      name: 'eventTitle',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'eventDates',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'eventLocation',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'emailSentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'emailError',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeOperation: [setMicrositeContext],
    beforeValidate: [defaultMicrositeFromContext, assignTicketToken],
    afterChange: [sendTicketEmailOnCreate],
  },
  timestamps: true,
}
