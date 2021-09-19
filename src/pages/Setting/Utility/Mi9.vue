<template>
  <q-page padding>
    <div class="q-py-lg">
      ดำเนินการ Migrate ข้อมูล โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>เพิ่ม id ใน wordList </li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 29 มิถุนายน 2564</div>
    </div>

    <q-btn color="red" @click="runMigration">run</q-btn>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'

export default {
  methods: {
    runMigration () {
      // const vm = this
      const r = [...Array(1).keys()]
      let batchCommit = 0
      let counterBatch = 0
      r.forEach(i => {
        db.collection('wordlist')
          // .where('tipitakaEdition', '==', vm.tipitakaEdition)
          .where('volumeNumber', '==', '3')
          // .where('pageNumber', '==', i)
          .get()
          .then(querySnapshot => {
            const batch = db.batch()
            counterBatch = 0
            querySnapshot.forEach(doc => {
              if (doc.data().id === undefined) {
                console.log('found undefined ' + doc.data().wordIndex)
                counterBatch = counterBatch + 1
                if (counterBatch < 501) {
                  batch.update(
                    db.collection('wordlist').doc(doc.id), {
                      id: doc.id
                    }
                  )
                }
              }
            })
            if (counterBatch > 0) {
              batch.commit().then(() => {
                batchCommit = batchCommit + 1
                console.log('commited ' + batchCommit)
              })
            }
            console.log(i)
          })
      })
    }
  }
}
</script>
