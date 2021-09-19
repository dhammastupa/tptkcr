<template>
  <q-page padding>
    <div class="q-py-lg">
      ดำเนินการ Migrate ข้อมูล โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>สร้าง logbook จากฐานข้อมูล tipitaka ในกรณี proofread </li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 4 มิถุนายน 2564</div>
    </div>
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
    <q-btn color="red" @click="runMigration">run</q-btn>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'
import savetoLogbook from 'src/mixins/saveto-logbook'

export default {
  mixins: [savetoLogbook],
  data () {
    return {
      tipitakas: [],
      tipitakaEdition: 'sya',
      volumeNumber: 1
    }
  },
  methods: {
    runMigration () {
      // const r = ['13', '19', '25', '26', '27', '29', '31', '32', '33', '35', '37', '38', '40', '41', '44', '45']
      // create
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', this.tipitakaEdition)
        .where('volumeNumber', '==', `${this.volumeNumber}`)
        .where('proofread', '==', true)
        .orderBy('pageNumber')
        .limit(500)
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            const element = doc.data()
            console.log('add:' + element.id + 'page: ' + element.pageNumber)
            batch.set(
              db.collection('logbook').doc(), {
                collection: 'tipitaka',
                collectionReference: doc.id,
                action: 'proofread',
                details: {
                  tipitakaEdition: element.tipitakaEdition,
                  volumeNumber: element.volumeNumber,
                  pageNumber: element.pageNumber,
                  imageReference: element.imageReference,
                  text: element.text
                },
                userName: element.createdBy,
                createdOn: element.createdOn
              }
            )
          })
          batch.commit().then(() => {
            console.log('commited : ' + `${this.volumeNumber}`)
          })
        })
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', this.tipitakaEdition)
        .where('volumeNumber', '==', `${this.volumeNumber}`)
        .where('pageNumber', '>=', 500)
        .where('proofread', '==', true)
        .orderBy('pageNumber')
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            const element = doc.data()
            console.log('add:' + element.id + 'page: ' + element.pageNumber)
            batch.set(
              db.collection('logbook').doc(), {
                collection: 'tipitaka',
                collectionReference: doc.id,
                action: 'proofread',
                details: {
                  tipitakaEdition: element.tipitakaEdition,
                  volumeNumber: element.volumeNumber,
                  pageNumber: element.pageNumber,
                  imageReference: element.imageReference,
                  text: element.text
                },
                userName: element.createdBy,
                createdOn: element.createdOn
              }
            )
          })
          batch.commit().then(() => {
            console.log('commited : ' + `${this.volumeNumber}`)
          })
        })
    }
  }
}
</script>
