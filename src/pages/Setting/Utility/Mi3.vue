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
        v-model.number="volumeNumber"
        type="number"
        filled
        style="max-width: 200px"
      />
      ดำเนินการ Migrate ข้อมูลเล่มที่ {{ volumeNumber }} โดยปรับปรุงตามรายละเอียดดังนี้
      <ol>
        <li>สร้างรายการใน collection : tipitaka โดยเพิ่มหน้าเข้าไปจากเล่มที่ยังไม่ได้มีการสร้างขึ้น</li>
        <li>อัปโหลดรูปขึ้นตามแฟ้มที่ดำเนินการ</li>
      </ol>
      <div>ได้ดำเนินการแล้วในวันที่ 30 มีนาคม 2564</div>
    </div>

    <div class="q-gutter-sm">
      <q-btn color="red" @click="runMigration">run generate record</q-btn>
      <q-btn color="red" @click="removeRecord">run remove record</q-btn>
    </div>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      tipitakaEdition: 'mcu',
      volumeNumber: 0,
      totalPages: 0
    }
  },
  methods: {
    runBatch (startPage, endPage) {
      const batch = db.batch()
      this._.forEach(this._.range(startPage, endPage, 1), i => {
        const newPageRef = db.collection('tipitaka').doc()
        batch.set(newPageRef, {
          createdOn: this.$Timestamp.now(),
          createdBy: this.userName,
          updatedOn: this.$Timestamp.now(),
          updatedBy: this.userName,
          id: newPageRef.id,
          tipitakaEdition: this.tipitakaEdition,
          volumeNumber: `${this.volumeNumber}`,
          pageNumber: i,
          imageReference: `${this.tipitakaEdition}/${this.volumeNumber}/${i}.jpg`,
          text: '',
          proofread: false,
          wordBoxs: [],
          personalSetting: [
            {
              lineHeight: 20,
              paddingTop: 10,
              uid: this.uid
            }
          ]
        })
      })
      batch.commit().then(() => {
        console.log('commited')
      })
    },
    runMigration () {
      // get total pages in selected volume/
      const vm = this
      console.log(vm.volumeNumber)
      db.collection('tipitakaEdition').doc(`${vm.tipitakaEdition}`).get()
        .then(snapshot => {
          const document = snapshot.data()
          vm.totalPages = vm._.filter(document.volume, ['number', `${vm.volumeNumber}`])[0].totalPages
          console.log(vm.totalPages)
          if (vm.totalPages > 500) {
            // first run
            vm.runBatch(1, 500)
            // second run
            vm.runBatch(501, parseInt(vm.totalPages) + 1)
          } else {
            vm.runBatch(1, parseInt(vm.totalPages) + 1)
          }
        })
    },
    removeRecord () {
      const vm = this
      console.log(vm.volumeNumber)
      db.collection('tipitaka')
        .where('volumeNumber', '==', `${vm.volumeNumber}`)
        // .where('volumeNumber', '==', vm.volumeNumber)
        .limit(500)
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => doc.data())
          const batch = db.batch()
          documents.forEach(doc => {
            batch.delete(db.collection('tipitaka').doc(doc.id))
          })
          batch.commit().then(() => {
            console.log('commited')
          })
        })
    }
  },
  computed: {
    ...mapState('auth', ['uid']),
    ...mapGetters('auth', ['userName'])
  }
}
</script>
