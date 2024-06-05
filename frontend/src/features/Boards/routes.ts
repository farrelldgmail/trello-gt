export default [
  {
    path: '/boards',
    component: () => import('../Global/layouts/MainLayout.vue'),
    children: [
      {
        name: 'boards',
        path: '',
        component: () => import('./components/BoardListView.vue'),
      },
      {
        name: 'board',
        path: '/:id',
        component: () => import('./components/BoardView.vue'),
      },
    ],
  },
];
