<template>
  <q-page padding>
    <div class="q-py-lg">
      ดำเนินการ Migrate ข้อมูล โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>แก้ไข wordIndex ใน wordList ซึ่งมีช่องว่างเกินมาหน้าคำ</li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 18 มิถุนายน 2564</div>
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
    <q-input
      class="q-py-sm"
      v-model.number="pageNumber"
      type="number"
      filled
      style="max-width: 200px"
    />
    <q-btn color="red" @click="runMigration">run</q-btn>
  </q-page>
</template>

<script>
import { db, FieldValue } from 'src/boot/firebase'
import { format } from 'quasar'

const { pad } = format

export default {
  data () {
    return {
      wordLists: [],
      tipitakaEdition: 'sya',
      volumeNumber: 1,
      pageNumber: 1
    }
  },
  methods: {
    runMigration () {
      // const r = ['13', '19', '25', '26', '27', '29', '31', '32', '33', '35', '37', '38', '40', '41', '44', '45']
      // create
      const vm = this
      db.collection('wordlist')
        .where('tipitakaEdition', '==', vm.tipitakaEdition)
        .where('volumeNumber', '==', `${vm.volumeNumber}`)
        .where('pageNumber', '==', vm.pageNumber)
        .orderBy('wordNumber')
        .limit(500)
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            const element = doc.data()
            // console.log('update:' + 'page: ' + element.pageNumber + 'wordNumber' + element.wordNumber)
            batch.update(
              db.collection('wordlist').doc(doc.id), {
                wordIndex: `${element.tipitakaEdition}-${pad(element.volumeNumber, 3)}-${pad(element.pageNumber, 4)}-${pad(element.wordNumber, 3)}`,
                wrodIndex: FieldValue.delete()
              }
            )
          })
          batch.commit().then(() => {
            console.log('commited : ' + `${vm.pageNumber}`)
          })
        })
    }
  },
  watch: {
    pageNumber () {
      this.runMigration()
    }
  }
}
</script>
