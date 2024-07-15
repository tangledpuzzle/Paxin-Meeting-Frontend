// eventBus.js

import mitt from 'mitt';

type Events = {
  notificationRead: number;
};

const eventBus = mitt<Events>();

export default eventBus;