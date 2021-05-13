<template>
  <q-page padding>
    <div class="q-py-md" style="max-width: 300px">
      <q-input v-model="t2q" label="Text" />
    </div>
    <q-btn color="red" @click="runQuery">run query</q-btn>
    <hr>
    {{ result }}
    <ul>
      <li v-for="item in result" :key="item.uid"></li>
    </ul>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'

export default {
  data () {
    return {
      t2q: '',
      result: []
    }
  },
  methods: {
    runQuery () {
      const vm = this
      db.collection('tipitaka')
        .where('text', '>=', vm.t2q)
        .where('text', '<=', vm.t2q)
        .get()
        .then(querySnapshot => {
          console.log(vm.result)
          vm.result = querySnapshot.docs.map(doc => doc.data())
        })
    }
  }
}
</script>
