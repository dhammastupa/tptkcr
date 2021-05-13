<template>
  <q-page padding>
    <div class="q-py-lg">
      ดำเนินการ Migrate ข้อมูล โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>สร้าง field เพิ่มใน document: tipitaka ชื่อ note </li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 11 พฤษภาคม 2564</div>
    </div>
    <q-btn disable color="red" @click="runMigration">run (disable)</q-btn>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'

export default {
  data () {
    return {
      tipitakas: []
    }
  },
  methods: {
    runMigration () {
      const i = '45'
      // const r = ['13', '19', '25', '26', '27', '29', '31', '32', '33', '35', '37', '38', '40', '41', '44', '45']
      db.collection('tipitaka')
        .where('volumeNumber', '==', i)
        .orderBy('pageNumber')
        .limit(500)
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            const element = doc.data()
            console.log(element.id)
            batch.update(
              db.collection('tipitaka').doc(doc.id), {
                note: ''
              }
            )
          })
          batch.commit().then(() => {
            console.log('commited : ' + i)
          })
        })
      db.collection('tipitaka')
        .where('volumeNumber', '==', i)
        .where('pageNumber', '>=', 500)
        .orderBy('pageNumber')
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            const element = doc.data()
            console.log(element.id)
            batch.update(
              db.collection('tipitaka').doc(doc.id), {
                note: ''
              }
            )
          })
          batch.commit().then(() => {
            console.log('commited : ' + i)
          })
        })
    }
  }
}
</script>
