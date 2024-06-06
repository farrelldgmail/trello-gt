// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { userSchema } from '../users/users.schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { BoardsService } from './boards.class'

// Main data model schema
export const boardsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    title: Type.String(),
    imageUrl: Type.String(),
    createdBy: Type.Ref(userSchema),
    updatedBy: Type.Ref(userSchema),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'Boards', additionalProperties: false }
)
export type Boards = Static<typeof boardsSchema>
export const boardsValidator = getValidator(boardsSchema, dataValidator)
export const boardsResolver = resolve<Boards, HookContext<BoardsService>>({
  createdBy: virtual(async (board, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(board.createdBy.toString());
  }),
  updatedBy: virtual(async (board, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(board.updatedBy.toString());
  })
})

export const boardsExternalResolver = resolve<Boards, HookContext<BoardsService>>({})

// Schema for creating new entries
export const boardsDataSchema = Type.Pick(boardsSchema, ['title','imageUrl'], {
  $id: 'BoardsData'
})
export type BoardsData = Static<typeof boardsDataSchema>
export const boardsDataValidator = getValidator(boardsDataSchema, dataValidator)

export const boardsDataResolver = resolve<Boards, HookContext<BoardsService>>({
  createdBy: async (_value, _board, context) => {
    // Associate the record with the id of the authenticated user
    return context.arguments[1].user._id;
  },
  createdAt: async () => {
    return new Date(Date.now()).toISOString();
  },
  updatedBy: async (_value, _board, context) => {
    // Associate the record with the id of the authenticated user
    return context.arguments[1].user._id;
  },
  updatedAt: async () => {
    return new Date(Date.now()).toISOString();
  },
});

// Schema for updating existing entries
export const boardsPatchSchema = Type.Partial(boardsSchema, {
  $id: 'BoardsPatch'
})
export type BoardsPatch = Static<typeof boardsPatchSchema>
export const boardsPatchValidator = getValidator(boardsPatchSchema, dataValidator)
export const boardsPatchResolver = resolve<Boards, HookContext<BoardsService>>({
  updatedBy: async (_value, _board, context) => {
    // Associate the record with the id of the authenticated user
    return context.arguments[2].user._id;
  },
  updatedAt: async () => {
    return new Date(Date.now()).toISOString();
  },
})

// Schema for allowed query properties
export const boardsQueryProperties = Type.Pick(boardsSchema, ['_id', 'title'])
export const boardsQuerySchema = Type.Intersect(
  [
    querySyntax(boardsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BoardsQuery = Static<typeof boardsQuerySchema>
export const boardsQueryValidator = getValidator(boardsQuerySchema, queryValidator)
export const boardsQueryResolver = resolve<BoardsQuery, HookContext<BoardsService>>({
})
