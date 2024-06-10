import { card } from './cards/cards'
import { list } from './lists/lists'
import { boards } from './boards/boards'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(card)
  app.configure(list)
  app.configure(boards)
  app.configure(user)
}
