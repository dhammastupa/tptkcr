<template>
  <q-page padding>
    <div class="q-py-lg">
      ดำเนินการ Migrate ข้อมูล โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>สร้าง field เพิ่มใน document: tipitaka ชื่อ proofread: bolean</li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 27 มีนาคม 2564</div>
    </div>
    <q-btn disable color="red" @click="runMigration">run</q-btn>
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
      db.collection('tipitaka')
        .where('volumeNumber', '==', '3')
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            console.log(doc.id)
            batch.update(
              db.collection('tipitaka').doc(doc.id), {
                proofread: false
              }
            )
          })
          batch.commit().then(() => {
            console.log('commited')
          })
        })
    }
  }
}
</script>
