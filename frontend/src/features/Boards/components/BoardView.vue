<script setup lang="ts">
  import { ref,computed } from 'vue';
  import { useFeathersService } from '@/feathers-client';
  import { useRoute } from 'vue-router';
  import { generateTimeAgo } from '../utils';

  const route = useRoute();

  const Board = useFeathersService('boards');
  const boards$ = Board.useGet(route.params.boardId);
  const board = computed(() => boards$.data);

  console.log('boards=', board);

  const showAddList = ref<boolean>(false);
  const showAddCard = ref<boolean>(false);

  const createList = () => {
    console.log('List will be created');
  }

  const createCard = () => {
    console.log('Card will be created');
  }
</script>

<template>
  <q-page @click="showAddList = false; showAddCard = false;" :style="`background: url(${board?.imageUrl}) center / cover;`">
    <div class="row bg-grey-7 text-h5 text-white q-pa-sm">
      Mon projet
    </div>
    <div class="row q-gutter-md q-pa-md">
      <div v-for="list in board?.lists" :key="list._id" class="col-3">
        <q-card :style="`background-color:${list.bgColor}`">
          <q-card-section class="q-py-xs qpx-s">
            <div class="row">
              <div class="col-10 self-start vertical-middle">
                <div class="q-pt-sm">
                  {{ list.text }}
                </div>
              </div>
              <div class="col-2 self-end">
                <q-btn
                  icon="more_horiz"
                  flat
                >
                  <q-menu touch-position>
                    <q-card>
                      <q-card-section class="row q-gutter-sm">
                        <q-avatar color="primary" size="lg">
                          <img :src="list.updatedBy.avatarUrl">
                        </q-avatar>
                        <div>
                          {{ list.updatedBy.fullName }}
                          <div class="text-grey-9">{{ generateTimeAgo(list.updatedAt) }}</div>
                        </div>
                      </q-card-section>
                      <q-card-actions class="column items-end q-gutter-sm">
                        <!-- REM TODO DF Add color picker -->
                        <q-btn class="bg-grey-6" icon-right="format_color_fill">Background color</q-btn>
                        <!-- REM TODO DF Add delete card -->
                        <q-btn flat color="red" icon="do_not_disturb_on">delete card</q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-menu>
                </q-btn>
              </div>
            </div>
            <div class="column q-gutter-xs">
              <div v-for="card in list?.cards" :key="card._id" class="col-12">
                <q-card class="q-pa-xs cursor-pointer" draggable>
                  {{ card.text }}
                </q-card>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn v-if="!showAddCard" flat @click.prevent.stop="showAddCard = true">Add a card</q-btn>
            <q-card v-if="showAddCard" class="q-pa-s">
              <q-card-actions class="qmx-sm">
                <div class="row">
                  <div class="col-lg-auto">
                    <q-input dense borderless @click.prevent.stop></q-input>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      icon="save"
                      color="red"
                      flat
                      @click.prevent.stop="createCard"
                    />
                </div>
                </div>
              </q-card-actions>
            </q-card>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-3">
        <q-btn v-if="!showAddList" flat align="left" class="width-100 shiftingOpacity" @click.prevent.stop="showAddList = true">Add a list</q-btn>
        <q-card v-if="showAddList" @click.prevent.stop>
          <q-card-actions class="qmx-sm">
            <div class="column">
              <div class="col-12">
                <q-input label="Name"></q-input>
              </div>
              <div class="col-12 q-mt-xl">
                <q-btn @click="createList">Create</q-btn>
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
  .shiftingOpacity {
    background-color: #000;
    color: #fff;
    opacity: 0.4;
  }
  .shiftingOpacity:hover {
    opacity: 0.7;
  }
</style>
