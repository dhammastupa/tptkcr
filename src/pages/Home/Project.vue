<template>
  <q-page padding>
    <div v-html="content.body"></div>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'

export default {
  data () {
    return {
      content: {}
    }
  },
  firestore: {
    content: db.collection('content').doc('project')
  }
}
</script>
