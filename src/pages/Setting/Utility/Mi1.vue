<template>
  <q-page padding>
    <div class="q-py-lg">
      ดำเนินการ Migrate ข้อมูล โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>สร้าง field เพิ่มใน document: tipitaka ชื่อ personalSetting: { uid: string, lineHeight: number, paddingTop: number } </li>
        <li>ทำการวนลูปเพื่อนำข้อมูลที่คุณธนัศทำไว้เก็บใน filed ดังกล่าว</li>
        <li>ทำการลบ field ที่เก็บข้อมูลเดิม (tipitaka.lineHeight, tipitaka.paddingTop)</li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 26 มีนาคม 2564</div>
    </div>
    <q-btn disable color="red" @click="runMigration">run</q-btn>
  </q-page>
</template>

<script>
import { db, FieldValue } from 'src/boot/firebase'

export default {
  data () {
    return {
      tipitakas: []
    }
  },
  methods: {
    runMigration () {
      const userId = 'kOUawCRxuTVVpZ9hENUjdTxM0Jf2'
      db.collection('tipitaka')
        .where('volumeNumber', '==', '3')
        .get()
        .then(querySnapshot => {
          const batch = db.batch()
          querySnapshot.forEach(doc => {
            const element = doc.data()
            console.log(element.id)
            batch.update(
              db.collection('tipitaka').doc(doc.id), {
                personalSetting: [
                  {
                    uid: userId,
                    lineHeight: element.lineHeight,
                    paddingTop: element.paddingTop
                  }
                ],
                lineHeight: FieldValue.delete(),
                paddingTop: FieldValue.delete()
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
