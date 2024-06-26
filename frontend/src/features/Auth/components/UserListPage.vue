<script setup lang="ts">
import type { User as UserType } from 'project-template-backend';
import type { ServiceInstance } from 'feathers-pinia';

import { useFeathersService } from '@/feathers-client';
import { type Ref, computed, ref } from 'vue';
import UserItem from '@f/Auth/components/UserItem.vue';
import UserForm from '@f/Auth/components/UserForm.vue';

const User = useFeathersService('users');

const params = computed(() => ({ query: {} }));
const users$ = User.useFind(params, { paginateOn: 'hybrid' });
const users = computed(() => users$.data);

const showCreateForm = ref<boolean>(false);
const newUser = ref(User.new());

const addUser = (userClone: Ref<ServiceInstance<UserType>>) => {
  userClone.value.save();
  showCreateForm.value = false;
  newUser.value = User.new();
};
</script>

<template>
  <q-page padding class="container q-mx-auto">
    <div class="row">
      <h1 class="text-h3 col">Users</h1>
      <div class="flex flex-center">
        <q-btn icon-right="add" color="primary" @click="showCreateForm = true"
          >Create</q-btn
        >
      </div>
    </div>
    <q-list bordered class="rounded-borders">
      <template v-if="users$.isPending">
        <q-item v-for="i in [1, 2, 3, 4]" :key="`user-shadow-${i}`">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="65%" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <user-item v-else :user="user" v-for="user in users" :key="user._id" />
      <q-dialog v-model="showCreateForm" persistent>
        <q-card class="col col-xs-12 col-sm-6 col-md-4">
          <user-form :user="newUser" @submit="addUser">
            <template #buttons>
              <q-btn v-close-popup class="col-12 col-sm-4 q-ma-sm"
                >Cancel</q-btn
              >
              <q-btn
                label="Add"
                type="submit"
                color="primary"
                class="col-12 col-sm-4 q-ma-sm"
              />
            </template>
          </user-form>
        </q-card>
      </q-dialog>
    </q-list>
  </q-page>
</template>
