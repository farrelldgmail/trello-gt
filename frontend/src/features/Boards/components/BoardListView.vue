<script setup lang="ts">
  import castleBackground from '@/assets/images/castle.jpg';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const showAddBoard = ref<boolean>(false);

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
      <div v-for="index in 6" :key="index" class="col-3">
        <q-card @click="showBoard(index)">
          <q-img :src="castleBackground">
            <div class="text-white text-h4 width-100">Title</div>
          </q-img>
          <q-card-actions>
            <div class="col-10 self-start vertical-middle">
              <div class="q-pt-sm">
              <q-avatar icon="person" color="primary" text-color="white" size="sm" class="q-mr-sm" />
              User - A while ago
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
