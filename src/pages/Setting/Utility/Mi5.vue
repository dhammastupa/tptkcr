<template>
  <q-page padding>
    <div class="q-py-lg">
      <q-input
        class="q-py-sm"
        v-model.number="tipitakaEdition"
        filled
        style="max-width: 200px"
      />
      <q-input
        class="q-py-sm"
        v-model.number="volumeNumber"
        type="number"
        filled
        style="max-width: 200px"
      />
      <q-btn disable color="red" @click="runMigration">run</q-btn>
    </div>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'

export default {
  data () {
    return {
      tipitakaEdition: 'sya',
      volumeNumber: 1
    }
  },
  methods: {
    runMigration () {
      // run 1st batch
      const batch1 = db.batch()
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', this.tipitakaEdition)
        .where('proofread', '==', true)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach((doc) => {
            batch1.update(
              db.collection('tipitaka').doc(doc.id), {
                proofread: false
              }
            )
          })
          batch1.commit().then(() => {
            console.log('commited1')
          })
        })
      // run 2nd batch
      const batch2 = db.batch()
      db.collection('wordlist')
        .where('tipitakaEdition', '==', this.tipitakaEdition)
        .limit(500)
        .get()
        .then(querySnapshot => {
          console.log('ok')
          querySnapshot.forEach((doc) => {
            batch2.delete(db.collection('wordlist').doc(doc.id))
          })
          batch2.commit().then(() => {
            console.log('commited2')
          })
        })
    }
  }
}
</script>
