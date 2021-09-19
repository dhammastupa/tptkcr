<template>
  <q-page>
    <!-- ////// -->
    <!-- header -->
    <!-- ////// -->
    <div class="q-pb-md">
      <q-banner inline-actions class="bg-blue-grey-1 text-black">
        <div class="text-h6">{{ tipitakaEdition.name }}</div>
        {{ tipitakaEdition.description }} {{ totalVolume }} {{ $t('operation.volumesSet') }}
        <template v-slot:action>
          <q-select
            flat bottom-slots
            v-model="selectedVolume"
            :options="volumeOptions"
            :label="$t('operation.selectVolume')"
            emit-value
            map-options
          >
            <template v-slot:hint>
              {{ totalPagesInSelectedVolume }} {{ $t('operation.pages') }}
            </template>
          </q-select>
        </template>
      </q-banner>
      <q-banner inline-actions class="bg-blue-grey-1 text-black q-px-lg">
        <q-range
          v-if="volumeOptions"
          v-model="pageRange"
          :min="1"
          :max="totalPagesInSelectedVolume"
          :step="10"
          label-always
          drag-only-range
        />
      </q-banner>
    </div>

    <!-- ///////// -->
    <!-- datatable -->
    <!-- ///////// -->
    <div class="q-pb-md">
      <q-table
        :grid="$q.screen.xs"
        :title="$t($options.name)"
        :data="tipitakas"
        :columns="columns"
        :filter="filter"
        row-key="id"
        :pagination="initialPagination"
        @row-click="onRowClick"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('systemLabel.search')">
            <template v-slot:append>
              <q-icon name="search" />
              <q-btn color="white" text-color="primary" round icon="add"
                class="q-ma-md"
                @click="onCreateBtnClick" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

    <!-- ////// -->
    <!-- dialog -->
    <!-- ////// -->
    <q-dialog
      v-model="dialog" persistent
      :maximized="true"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card>
        <!-- draggable ruler -->
        <div id="draggable" v-if="action=='update' & showRuler==true" v-draggable="draggableValue">
          <div :ref="handleId">
            <!-- ปรับระหว่างบรรทัด -->
            <div class="q-gutter q-pa-sm bg-white">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-slider
                    v-model="paddingTop"
                    :min="0"
                    :max="600"
                    label
                    :label-value="$t('operation.paddingTop')"
                  />
                </div>
                <div class="col">
                  <q-slider
                    v-model="lineHeight"
                    :min="20"
                    :max="40"
                    :step="0.5"
                    label
                    :label-value="$t('operation.lineSpacing')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- header -->
        <q-banner inline-actions
          :class="{ 'text-white': true, 'bg-primary': action=='update', 'bg-secondary': action=='create' }">
          <q-icon v-if="action=='create'" name="add" size="sm" />
          <q-icon v-else name="drive_file_rename_outline" size="sm" />
          {{ $t($options.name) }}
          <template v-slot:action>
            <div class="q-gutter-sm">
              <!-- ก่อนหน้า -->
              <q-btn flat :disable="previousPageStatus" round icon="arrow_back" @click="goPrevious"></q-btn>
              <!-- ถัดไป -->
              <q-btn flat :disable="nextPageStatus" round icon="arrow_forward" @click="goNext"></q-btn>
              <!-- ปิด ไม่บันทึก -->
              <q-btn dense flat icon="close" v-close-popup />
              <!-- ปิด และบันทึก -->
              <q-btn dense flat icon="save" v-close-popup @click="onSubmit" />
            </div>
          </template>
        </q-banner>

        <!-- form -->
        <q-card-section>
          <q-form v-if="tipitaka"
            ref="tipitakaForm"
            @submit="onSubmit"
          >
            <!-- edition / volumeNumber / pageNumber -->
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-4">
                <q-select
                  outlined readonly
                  v-model="tipitaka.tipitakaEdition"
                  :options="tipitakaEditionOptions"
                  :label="$t('operation.tipitakaEdition')"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  outlined bottom-slots readonly
                  v-model="tipitaka.volumeNumber"
                  :options="volumeOptions"
                  :label="$t('operation.volumeNumber')"
                  emit-value
                  map-options
                >
                  <template v-slot:hint>
                    {{ totalPagesInSelectedVolume }} {{ $t('operation.pages') }}
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-2">
                <q-select
                  :filled="action=='create'"
                  :outlined="action=='update'"
                  :readonly="action=='update'"
                  v-model="tipitaka.pageNumber"
                  :options="pageOptions"
                  :label="$t('operation.pageNumber')"
                />
              </div>
            </div>

            <!-- upload image -->
            <div v-if="!tipitaka.imageReference"
              class="row q-py-lg">
              <div class="col-12 col-md-6 offset-md-3">
                <q-firebase-uploader
                  style="width: 100%"
                  :label="$t('operation.uploadImage')"
                  accept=".jpg"
                  :path="`${tipitaka.tipitakaEdition}/${tipitaka.volumeNumber}/${tipitaka.pageNumber}.jpg`"
                  @upload="onGetBackInfo"
                />
              </div>
            </div>

            <!-- digitizing -->
            <div v-else class="ro q-py-lg">
              <div class="col-12">
                <q-splitter v-model="splitterModel">
                  <!-- image -->
                  <template v-slot:before>
                    <div class="col q-pa-sm">{{$t('operation.image')}}</div>
                    <q-banner inline-actions class="bg-grey-3">
                      <div class="q-gutter">
                        <!-- เปิดลิงค์ภาพ -->
                        <q-btn type="a" :href="imagePathReference" target="_blank" flat round icon="launch"/>
                        <!-- แสดงไม้บรรทัด -->
                        <q-btn :color="showRuler ? 'purple' : 'black'" flat round icon="straighten" @click="showRuler=!showRuler"/>
                      </div>
                      <template v-slot:action>
                        <div class="q-gutter">
                          <!-- ลบภาพ -->
                          <q-btn v-if="hasPermission('tipitaka-deleteAction')"
                            flat round icon="delete" @click="onDeleteImage"/>
                        </div>
                      </template>
                    </q-banner>
                    <q-img v-if="tipitaka.imageReference"
                      :src="imagePathReference"
                      spinner-color="white"
                    />
                  </template>
                  <!-- text -->
                  <template v-slot:after>
                    <div class="col q-pa-sm">{{$t('operation.text')}}</div>
                    <q-banner inline-actions class="bg-grey-3">
                      <template v-slot:action>
                        <div class="q-gutter">
                          <!-- ลบเคาะที่เกิน -->
                          <q-btn flat round icon="margin" @click="removeExtraSpace">
                            <q-tooltip>
                              {{ $t('operation.removeExtraSpace') }}
                            </q-tooltip>
                          </q-btn>
                          <!-- พิสูจน์อักษร -->
                          <q-toggle
                            v-if="hasPermission('tipitaka-proofread')"
                            v-model="tipitaka.proofread"
                            checked-icon="check"
                            color="red"
                            unchecked-icon="clear"
                            @input="onCreateWordlistBtnClick()"
                          >
                            <q-tooltip>
                              {{ $t('operation.proofread') }}
                            </q-tooltip>
                          </q-toggle>
                          <!-- ลบรายการ -->
                          <q-btn v-if="action=='update' && hasPermission('tipitaka-deleteAction')"
                            flat round icon="delete" color="red" @click="onDeleteRecord"
                          >
                            <q-tooltip>
                              {{ $t('systemLabel.deleteRecord') }}
                            </q-tooltip>
                          </q-btn>
                          <!-- บันทึกรายการ -->
                          <q-btn flat round icon="save" @click="onSubmit">
                            <q-tooltip>
                              {{ $t('systemLabel.saveRecord') }}
                            </q-tooltip>
                          </q-btn>
                        </div>
                      </template>
                    </q-banner>
                    <div class="q-pa-md q-gutter-sm">
                      <codemirror ref="myCm" id='cmx'
                        v-model="tipitaka.text"
                        :options="cmOptions"
                        @ready="onCmReady"
                        v-bind:style="{'padding-top': `${paddingTop}px`}" >
                      </codemirror>
                      <div class="q-py-md">{{ $t('systemLabel.note') }}</div>
                      <q-editor v-model="tipitaka.note" min-height="5rem" />
                    </div>
                  </template>
                </q-splitter>
              </div>
            </div>

            <!-- footer -->
            <div v-if="action=='update'" class="row q-col-gutter-sm">
              <div class="col-12 col-md-3">
                <q-input
                  v-if="tipitaka.createdOn"
                  :value="tipitaka.createdOn | toDateTime"
                  :label="$t('systemLabel.createdOn')"
                  readonly
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-if="tipitaka.createdBy"
                  :value="tipitaka.createdBy"
                  :label="$t('systemLabel.createdBy')"
                  readonly
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-if="tipitaka.createdOn"
                  :value="tipitaka.createdOn | toDateTime"
                  :label="$t('systemLabel.createdOn')"
                  readonly
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-if="tipitaka.updatedBy"
                  :value="tipitaka.updatedBy"
                  :label="$t('systemLabel.updatedBy')"
                  readonly
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { format } from 'quasar'
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
import { mapState, mapGetters } from 'vuex'
import { db, storage } from 'src/boot/firebase'
import { Draggable } from 'draggable-vue-directive'
import { showMessage } from 'src/functions/function-show-message'
import timestamp2Datetime from 'src/mixins/filter-timestamp-datetime'
import QFirebaseUploader from 'src/components/Operation/Tipitaka/QFirebaseUploader'
import savetoLogbook from 'src/mixins/saveto-logbook'

const { pad } = format

export default {
  name: 'operation.digitization',
  mixins: [timestamp2Datetime, savetoLogbook],
  directives: {
    Draggable
  },
  components: {
    QFirebaseUploader,
    codemirror
  },
  data () {
    return {
      // draggable
      handleId: 'handle-id',
      showRuler: false,
      draggableValue: {
        handle: undefined
      },
      // dialog
      dialog: false,
      splitterModel: 50,
      action: 'add',
      filter: '',
      tipitakaEdition: '',
      tipitakaEditionOptions: [],
      totalVolume: '',
      volumeOptions: [],
      selectedVolume: '1',
      pageOptions: [],
      pageRange: {
        min: 1,
        max: 20
      },
      paddingTop: 10,
      lineHeight: 20,
      // datatable & form
      initialPagination: {
        sortBy: 'pageNumber',
        descending: false,
        rowsPerPage: 20
      },
      tipitakas: [],
      tipitaka: {
        id: '',
        tipitakaEdition: '',
        volumeNumber: '1',
        pageNumber: '1',
        imageReference: '',
        text: '',
        proofread: false,
        note: '',
        wordBoxs: [],
        personalSetting: [],
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      },
      // codemirror options
      cmOptions: {
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity,
        readOnly: false
      },
      // other
      imagePathReference: ''
    }
  },
  computed: {
    ...mapState('auth', ['uid', 'permission']),
    ...mapGetters('auth', ['userName']),
    columns () {
      const columns = [
        {
          name: 'pageNumber',
          field: 'pageNumber',
          label: this.$t('operation.pageNumber'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'text',
          field: 'text',
          label: this.$t('operation.text'),
          sortable: true,
          align: 'left',
          classes: 'bg-blue-grey-1 ellipsis',
          style: 'max-width: 250px',
          headerStyle: 'max-width: 250px'
        },
        {
          name: 'proofread',
          field: 'proofread',
          format: val => (val === true) ? '✓' : '',
          label: this.$t('operation.proofread'),
          sortable: false,
          align: 'center'
        },
        {
          name: 'createdOn',
          field: 'createdOn',
          format: val => `${new Date(val.toDate()).toDateString()}`,
          label: this.$t('systemLabel.createdOn'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'updatedOn',
          field: 'updatedOn',
          format: val => `${new Date(val.toDate()).toDateString()}`,
          label: this.$t('systemLabel.updatedOn'),
          sortable: true,
          align: 'left'
        }
      ]
      return columns
    },
    totalPagesInSelectedVolume () {
      let result = 100
      if (this.volumeOptions.length) {
        result = this._.find(this.volumeOptions, ['value', this.selectedVolume])
      }
      return result.pages
    },
    routeParam () {
      return this.$route.params.id
    },
    codemirror () {
      return this.$refs.myCm.codemirror
    },
    previousPageStatus () {
      if (this.tipitaka) {
        if (this.tipitaka.pageNumber > 1) {
          return false
        }
      }
      return true
    },
    nextPageStatus () {
      if (this.tipitaka) {
        if (this.tipitaka.pageNumber < this.totalPagesInSelectedVolume) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    datatableSource () {
      this.$bind('tipitakas', db.collection('tipitaka')
        .where('tipitakaEdition', '==', this.tipitakaEdition.code)
        .where('volumeNumber', '==', this.selectedVolume)
        .where('pageNumber', '>=', this.pageRange.min)
        .where('pageNumber', '<=', this.pageRange.max)
      ).then(tipitakas => {
        // documents will point to the same property declared in data:
        // this.documents === documents
      })
    },
    loadData () {
      db.collection('tipitakaEdition').orderBy('code').get()
        .then(querySnapshot => {
          // get tipitakaEditionOptions
          this.tipitakaEditionOptions = []
          querySnapshot.forEach((doc) => {
            const element = doc.data()
            this.tipitakaEditionOptions.push({
              value: element.code,
              label: element.name
            })
          })
          // get totalVolume and volumeOptions in this Editon
          const tipitakaEditions = querySnapshot.docs.map(doc => doc.data())
          this.tipitakaEdition = this._.find(tipitakaEditions, ['code', this.routeParam])
          // totalVolume
          this.totalVolume = this.tipitakaEdition.volumes
          this.volumeOptions = []
          this.selectedVolume = '1'
          // volumeOptions
          this.tipitakaEdition.volume.forEach(element => {
            this.volumeOptions.push({
              value: element.number,
              label: element.number + ') ' + element.name,
              pages: parseInt(element.totalPages)
            })
          })
          // bind tipitaka
          this.datatableSource()
        })
    },
    onRowClick (evt, row) {
      this.bindData(row.id)
    },
    bindData (id) {
      const vm = this
      vm.$bind('tipitaka', db.collection('tipitaka').doc(id))
        .then(() => {
          // set parameter
          vm.dialog = true
          vm.action = 'update'
          // adjust data
          this.createPersonalSetting()
          // get image
          storage.ref().child(`${vm.tipitaka.imageReference}`).getDownloadURL()
            .then((url) => {
              vm.imagePathReference = url
            }).catch(error => {
              showMessage('systemMessage.errorTitle', 'systemMessage.error')
              console.log(error)
            })
          // cmOptions
          this.cmOptions.readOnly = this.tipitaka.proofread
        })
    },
    goPrevious () {
      this.onSubmit()
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', this.tipitaka.tipitakaEdition)
        .where('volumeNumber', '==', this.tipitaka.volumeNumber)
        .where('pageNumber', '==', this.tipitaka.pageNumber - 1)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const documents = querySnapshot.docs.map(doc => doc.data())
            this.bindData(documents[0].id)
          }
        })
    },
    goNext () {
      this.onSubmit()
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', this.tipitaka.tipitakaEdition)
        .where('volumeNumber', '==', this.tipitaka.volumeNumber)
        .where('pageNumber', '==', this.tipitaka.pageNumber + 1)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const documents = querySnapshot.docs.map(doc => doc.data())
            this.bindData(documents[0].id)
          }
        })
    },
    createPersonalSetting () {
      // ตรวจสอบว่ามีข้อมูลเดิมหรือไม่
      if (!this.tipitaka.personalSetting) {
        this.tipitaka.personalSetting = []
      }
      if (!this._.find(this.tipitaka.personalSetting, ['uid', this.uid])) {
        // ถ้าไม่มี ให้เพิ่มข้อมูล
        this.tipitaka.personalSetting.push({
          uid: this.uid,
          paddingTop: 10,
          lineHeight: 20
        })
      }
      const mySetting = this._.find(this.tipitaka.personalSetting, ['uid', this.uid])
      this.paddingTop = mySetting.paddingTop
      this.lineHeight = mySetting.lineHeight
    },
    onCreateBtnClick () {
      this.dialog = true
      this.action = 'create'

      const vm = this
      vm.pageOptions = this._.range(1, vm.totalPagesInSelectedVolume + 1)
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', vm.tipitakaEdition.code)
        .where('volumeNumber', '==', vm.selectedVolume)
        .get()
        .then(querySnapshot => {
          // เอาข้อมูลของฉบับและเล่มที่เลือกมา เพื่อดูว่าทำหน้าไหนไปแล้วบ้าง
          const documents = querySnapshot.docs.map(doc => doc.data())
          const createdPages = this._.map(documents, 'pageNumber')
          // จากนั้นให้ทำการกรองออกให้เหลือเฉพาะที่ยังไม่มี
          const filtered = this._.filter(vm.pageOptions, function (o) { return !createdPages.includes(o) })
          vm.pageOptions = filtered
          vm.tipitaka = {
            id: '',
            tipitakaEdition: vm.routeParam,
            volumeNumber: vm.selectedVolume,
            pageNumber: vm.pageOptions[0],
            imageReference: '',
            text: '',
            wordBoxs: [],
            personalSetting: [
              {
                uid: vm.uid,
                paddingTop: 10,
                lineHeight: 20
              }
            ],
            createdOn: vm.$Timestamp.now(),
            createdBy: vm.userName,
            updatedOn: vm.$Timestamp.now(),
            updatedBy: vm.userName
          }
        })
    },
    onSubmit () {
      const vm = this
      vm.$refs.tipitakaForm.validate().then(success => {
        vm.tipitaka.personalSetting.forEach(item => {
          if (item.uid === vm.uid) {
            item.lineHeight = vm.lineHeight
            item.paddingTop = vm.paddingTop
          }
        })
        if (success) {
          if (vm.action === 'create') {
            // crate new document id and set data to doc
            const newDoc = db.collection('tipitaka').doc()
            newDoc.set({
              id: newDoc.id,
              tipitakaEdition: vm.tipitaka.tipitakaEdition,
              volumeNumber: vm.tipitaka.volumeNumber,
              pageNumber: vm.tipitaka.pageNumber,
              imageReference: vm.tipitaka.imageReference,
              text: vm.tipitaka.text,
              wordBoxs: vm.tipitaka.wordBoxs,
              personalSetting: vm.tipitaka.personalSetting,
              proofread: false,
              note: vm.tipitaka.note,
              createdOn: vm.$Timestamp.now(),
              createdBy: vm.userName,
              updatedOn: vm.$Timestamp.now(),
              updatedBy: vm.userName
            }).then(() => {
              // update logbook
              this.saveToLogbook('tipitaka',
                'add',
                newDoc.id,
                {
                  tipitakaEdition: vm.tipitaka.tipitakaEdition,
                  volumeNumber: vm.tipitaka.volumeNumber,
                  pageNumber: vm.tipitaka.pageNumber,
                  imageReference: vm.tipitaka.imageReference,
                  text: vm.tipitaka.text
                })
              showMessage('systemMessage.infoTitle', 'systemMessage.success')
            }).catch(error => {
              showMessage('systemMessage.errorTitle', 'systemMessage.error')
              console.log(error)
            })
          } else if (vm.action === 'update') {
            vm.$firestoreRefs.tipitaka.update({
              id: vm.tipitaka.id,
              tipitakaEdition: vm.tipitaka.tipitakaEdition,
              volumeNumber: vm.tipitaka.volumeNumber,
              pageNumber: vm.tipitaka.pageNumber,
              imageReference: vm.tipitaka.imageReference,
              text: vm.tipitaka.text,
              wordBoxs: vm.tipitaka.wordBoxs,
              personalSetting: vm.tipitaka.personalSetting,
              proofread: vm.tipitaka.proofread,
              note: vm.tipitaka.note,
              updatedOn: vm.$Timestamp.now(),
              updatedBy: vm.userName
            }).then(() => {
              // update logbook
              this.saveToLogbook('tipitaka',
                'add',
                vm.$firestoreRefs.tipitaka.id,
                {
                  tipitakaEdition: vm.tipitaka.tipitakaEdition,
                  volumeNumber: vm.tipitaka.volumeNumber,
                  pageNumber: vm.tipitaka.pageNumber,
                  imageReference: vm.tipitaka.imageReference,
                  text: vm.tipitaka.text
                })
              showMessage('systemMessage.infoTitle', 'systemMessage.updateSuccess')
            }).catch(error => {
              showMessage('systemMessage.errorTitle', 'systemMessage.error')
              console.log(error)
            })
          }
        } else {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
        }
      })
    },
    onDeleteRecord () {
      this.$q.dialog({
        title: this.$t('systemLabel.confirm'),
        message: this.$t('systemLabel.confirmToDelete'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
        // update logbook
        this.saveToLogbook('tipitaka',
          'delete',
          this.selected,
          {})
        // !!! อย่าลืมกลับมาลบ wordlist ด้วย
        storage.ref().child(this.tipitaka.imageReference).delete()
        this.$firestoreRefs.tipitaka.delete()
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      })
    },
    // after upload image
    onGetBackInfo (value) {
      this.tipitaka.imageReference = `${this.tipitaka.tipitakaEdition}/${this.tipitaka.volumeNumber}/${this.tipitaka.pageNumber}.jpg`
      this.imagePathReference = value.url
      this.onSubmit()
    },
    onDeleteImage () {
      const vm = this
      storage.ref().child(vm.tipitaka.imageReference).delete()
        .then(() => {
          showMessage('systemMessage.infoTitle', 'systemMessage.deleted')
          vm.tipitaka.imageReference = ''
          vm.onSubmit()
        })
        .catch(error => {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
          console.log(error)
        })
    },
    removeExtraSpace () {
      // this.tipitaka.text = this.tipitaka.text.replace(/\s+/g, ' ').trim()
      const splitLines = this._.split(this.tipitaka.text, '\n')
      const removeExtraSpaceArray = []
      splitLines.forEach(eachLine => {
        removeExtraSpaceArray.push(eachLine.replace(/\s+/g, ' ').trim())
      })
      this.tipitaka.text = this._.join(removeExtraSpaceArray, '\n')
    },
    assignCodeMirrorCSS () {
      const checkExist = setInterval(() => {
        if (document.querySelector('#cmx div.CodeMirror')) {
          document.querySelector('#cmx div.CodeMirror').style.lineHeight = `${this.lineHeight}px`
          // document.querySelector('#cmx div.CodeMirror').focus()
          // document.querySelector('#cmx div.CodeMirror').setCursor({ line: 1, ch: 5 })
          clearInterval(checkExist)
        }
      }, 300)
    },
    onCreateWordlistBtnClick () {
      this.$q.dialog({
        title: this.$t('systemLabel.confirm'),
        message: (this.tipitaka.proofread) ? this.$t('operation.confirmToCreateWrodlist') : this.$t('operation.confirmToRemoveWrodlist'),
        persistent: true,
        ok: {
          flat: true,
          color: 'negative',
          label: this.$t('systemLabel.confirm')
        },
        cancel: {
          flat: true,
          color: 'secondary',
          label: this.$t('systemLabel.cancel')
        }
      }).onOk(() => {
        if (this.tipitaka.proofread) {
          this.saveToLogbook(
            'tipitaka',
            'proofread',
            this.tipitaka.id,
            { proofread: this.tipitaka.proofread })
          this.createWordlist()
        } else {
          this.saveToLogbook(
            'tipitaka',
            'un-proofread',
            this.tipitaka.id,
            { proofread: this.tipitaka.proofread })
          this.removeWordlist()
        }
        this.onSubmit()
        this.cmOptions.readOnly = this.tipitaka.proofread
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        this.tipitaka.proofread = !this.tipitaka.proofread
      })
    },
    createWordlist () {
      if (this.tipitaka.text) {
        const batch = db.batch()
        const lines = this.tipitaka.text.split('\n')
        let lineNumber = 0
        let wordNumber = 0
        lines.forEach(line => {
          lineNumber++
          const words = line.split(' ')
          words.forEach(word => {
            wordNumber++
            const newDoc = db.collection('wordlist').doc()
            batch.set(
              db.collection('wordlist').doc(newDoc.id), {
                id: newDoc.id,
                word: word,
                lineNumber: lineNumber,
                wordNumber: wordNumber,
                // reference
                tipitakaReference: db.collection('tipitaka').doc(`${this.tipitaka.id}`),
                tipitakaRecordId: this.tipitaka.id,
                tipitakaEdition: this.tipitaka.tipitakaEdition,
                volumeNumber: this.tipitaka.volumeNumber,
                pageNumber: this.tipitaka.pageNumber,
                imageReference: this.tipitaka.imageReference,
                wordIndex: `${this.tipitaka.tipitakaEdition}-${pad(this.tipitaka.volumeNumber, 3)}-${pad(this.tipitaka.pageNumber, 4)}-${pad(wordNumber, 3)}`
              }
            )
          })
        })
        batch.commit().then(() => {
          console.log('commited')
        })
      }
    },
    removeWordlist () {
      const batch = db.batch()
      db.collection('wordlist')
        .where('tipitakaRecordId', '==', this.tipitaka.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach((doc) => {
            batch.delete(db.collection('wordlist').doc(doc.id))
          })
          batch.commit().then(() => {
            console.log('commited')
          })
        })
    },
    hasPermission (requirePermisssion) {
      return this._.includes(this.permission, requirePermisssion)
    },
    adjustLineHeight () {
      if (document.querySelector('#cmx div.CodeMirror')) {
        document.querySelector('#cmx div.CodeMirror').style.lineHeight = `${this.lineHeight}px`
      }
    },
    onCmReady () {
      this.adjustLineHeight()
    }
  },
  watch: {
    routeParam () {
      this.loadData()
    },
    'tipitaka.imageReference' () {
      this.assignCodeMirrorCSS()
    },
    lineHeight () {
      this.adjustLineHeight()
    },
    pageRange () {
      this.datatableSource()
    },
    selectedVolume () {
      this.datatableSource()
      this.pageRange = {
        min: 1,
        max: 20
      }
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
    this.draggableValue.handle = this.$refs[this.handleId]
  }
}
</script>

<style scoped>
  #draggable {
    z-index: 99;
    margin: 0;
    background: #c8e6c9 !important;
    position: absolute;
    top: 125px;
    opacity: 0.8;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 25%;
    padding-right: 25%;
  }
</style>
