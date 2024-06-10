import { type FeathersService, feathers } from '@feathersjs/feathers';
import authenticationClient from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import { createPiniaClient, ServiceInstance, useInstanceDefaults } from 'feathers-pinia';
import { pinia } from './modules/pinia';
import { Boards } from 'project-template-backend';
import { computed } from 'vue';

const host =
  (import.meta.env.VITE_MY_API_URL as string) || 'http://localhost:3030';
const socket = io(host, { transports: ['websocket'] });

export const feathersClient = feathers<Record<string, FeathersService>>()
  .configure(socketio(socket))
  .configure(authenticationClient({ storage: window.localStorage }));

export const api = createPiniaClient(feathersClient, {
  pinia,
  idField: '_id',
  // optional
  ssr: false,
  whitelist: [],
  paramsForServer: [],
  syncWithStorage: true,
  skipGetIfExists: true,
  customSiftOperators: {},
  setupInstance(data) {
    return data;
  },
  customizeStore() {
    return {};
  },
  services: {
    boards: {
      setupInstance(data: ServiceInstance<Boards>, { app }) {
        app.pushToStore(data.lists, 'lists');
        data.lists = computed(() => app.service("lists").findInStore({ query: { boardId: data._id } }).data);
        return useInstanceDefaults({ title: '', imageUrl: '' }, data);
      },
    },
    lists: {
      setupInstance(data: ServiceInstance<Lists>, { app }) {
        app.pushToStore(data.cards, 'cards');
        data.cards = computed(() => app.service("cards").findInStore({ query: { listId: data._id } }).data);
        return useInstanceDefaults({ text: '' }, data);
      },
    },
  },
});

export function useFeathers() {
  return { api };
}

export const useFeathersService = (
  servicePath: string,
  clientAlias = 'api',
) => {
  const clients = useFeathers();
  const client = clients[clientAlias as keyof typeof clients];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return client.service(servicePath as any);
};
