// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ListService } from './lists.class'
import { userSchema } from '../users/users.schema';

// Main data model schema
export const listSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    text: Type.String(),
    bgColor: Type.String(),
    boardId: Type.String(),
    cards: Type.Array(Type.Any()),
    createdBy: Type.Ref(userSchema),
    updatedBy: Type.Ref(userSchema),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'List', additionalProperties: false }
)
export type List = Static<typeof listSchema>
export const listValidator = getValidator(listSchema, dataValidator)
export const listResolver = resolve<List, HookContext<ListService>>({
  createdBy: virtual(async (list, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(list.createdBy.toString());
  }),
  updatedBy: virtual(async (list, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(list.updatedBy.toString());
  }),
  cards: virtual(async (list, context) => {
    // Associate the cards belonging to the list
    return (await context.app.service('cards').find({ query: { listId: list._id.toString() } })).data;
  })
})

export const listExternalResolver = resolve<List, HookContext<ListService>>({})

// Schema for creating new entries
export const listDataSchema = Type.Pick(listSchema, ['text', 'boardId'], {
  $id: 'ListData'
})
export type ListData = Static<typeof listDataSchema>
export const listDataValidator = getValidator(listDataSchema, dataValidator)
export const listDataResolver = resolve<List, HookContext<ListService>>({
  createdBy: async (_value, _list, context) => {
    // Associate the record with the id of the authenticated user
    return context.arguments[1].user._id;
  },
  createdAt: async () => {
    return new Date(Date.now()).toISOString();
  },
  updatedBy: async (_value, _list, context) => {
    // Associate the record with the id of the authenticated user
    return context.arguments[1].user._id;
  },
  updatedAt: async () => {
    return new Date(Date.now()).toISOString();
  },
})

// Schema for updating existing entries
export const listPatchSchema = Type.Partial(listSchema, {
  $id: 'ListPatch'
})
export type ListPatch = Static<typeof listPatchSchema>
export const listPatchValidator = getValidator(listPatchSchema, dataValidator)
export const listPatchResolver = resolve<List, HookContext<ListService>>({
  updatedBy: async (_value, _list, context) => {
    // Associate the record with the id of the authenticated user
    return context.arguments[2].user._id;
  },
  updatedAt: async () => {
    return new Date(Date.now()).toISOString();
  },
})

// Schema for allowed query properties
export const listQueryProperties = Type.Pick(listSchema, ['_id', 'boardId'])
export const listQuerySchema = Type.Intersect(
  [
    querySyntax(listQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ListQuery = Static<typeof listQuerySchema>
export const listQueryValidator = getValidator(listQuerySchema, queryValidator)
export const listQueryResolver = resolve<ListQuery, HookContext<ListService>>({})
