<script setup lang="ts">
  // import type { Boards } from 'project-template-backend';
  import { useFeathersService } from '@/feathers-client';
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const Board = useFeathersService('boards');
  const params = computed(() => ({ query: {} }));
  const boards$ = Board.useFind(params, { paginateOn: 'server' });
  const boards = computed(() => boards$.data);

  const router = useRouter();

  const showAddBoard = ref<boolean>(false);

  // const newBoard = ref<Boards>();

  const showBoard = (id) => {
    router.push({ "name": "board", "params": { id } });
  }

  const createBoard = () => {
    console.log('Board will be created');
  }

  const deleteBoard = (id) => {
    console.log(`Board ${id} will be deleted`);
  }
</script>

<template>
  <q-page padding class="cursor-pointer" @click="showAddBoard = false">
    <div class="row q-gutter-md">
      <div v-for="board in boards" :key="board.id" class="col-3">
        <q-card @click="showBoard(id)">
          <q-img :src="board.imageUrl">
            <div class="text-white text-h4 width-100">{{ board.title }}</div>
          </q-img>
          <q-card-actions>
            <div class="col-10 self-start vertical-middle">
              <div class="q-pt-sm">
              <q-avatar icon="person" color="primary" text-color="white" size="sm" class="q-mr-sm" />
                {{ board.updatedBy.fullName }} - A while ago
              </div>
            </div>
            <div class="col-2 self-end">
              <q-btn
                icon="delete"
                color="red"
                flat
                @click.prevent.stop="deleteBoard(index)"
              />
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-3">
        <q-btn v-if="!showAddBoard" align="left" class="width-100 text-left" @click.prevent.stop="showAddBoard = true">Add a board</q-btn>
        <q-card v-if="showAddBoard" @click.prevent.stop>
          <q-card-actions class="qmx-sm">
            <div class="column">
              <div class="col-12">
                <q-input label="Name"></q-input>
              </div>
              <div class="col-12">
                <q-input label="Background"></q-input>
              </div>
              <div class="col-12 q-mt-xl">
                <q-btn @click="createBoard">Create</q-btn>
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
