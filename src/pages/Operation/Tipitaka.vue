<template>
  <q-page padding>
    <!-- ////// -->
    <!-- header -->
    <!-- ////// -->
    <div class="q-pa-md">
      <q-banner inline-actions class="bg-grey-2 text-black">
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
      <q-banner inline-actions class="bg-grey-2 text-black q-px-lg">
        <q-range
          v-if="volumeOptions"
          v-model="pageRange"
          :min="1"
          :max="totalPagesInSelectedVolume"
          label-always
          drag-only-range
        />
      </q-banner>
    </div>

    <!-- ///////// -->
    <!-- datatable -->
    <!-- ///////// -->
    <div class="q-pa-md">
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
        <!-- header -->
        <q-banner inline-actions
          :class="{ 'text-white': true, 'bg-primary': action=='update', 'bg-secondary': action=='create' }">
          <q-icon v-if="action=='create'" name="add" size="sm" />
          <q-icon v-else name="drive_file_rename_outline" size="sm" />
          {{ $t($options.name) }}
          <template v-slot:action>
            <q-btn dense flat icon="close" v-close-popup />
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
                    <q-banner inline-actions class="bg-grey-3">
                      {{$t('operation.image')}}
                      <template v-slot:action>
                        <div class="q-gutter">
                          <q-btn type="a" :href="imagePathReference" target="_blank" flat round icon="launch"/>
                          <q-btn flat round icon="delete" @click="onDeleteImage"/>
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
                    <q-banner inline-actions class="bg-grey-3">
                      <div class="row">
                        <div class="col q-pt-sm">{{$t('operation.text')}}</div>
                        <div class="col">
                          <q-slider v-model="tipitaka.paddingTop" :min="0" :max="600" />
                        </div>
                      </div>
                      <template v-slot:action>
                        <div class="q-gutter">
                          <!-- lineHeight -->
                          <q-btn flat round icon="vertical_distribute" @click="increaseLineHeight"/>
                          <q-btn flat round icon="menu" @click="decreaseLineHeight"/>
                          <!-- removeExtraSpace -->
                          <q-btn flat round icon="margin" @click="removeExtraSpace"/>
                          <!-- deleteRecord -->
                          <q-btn v-if="action=='update'"
                            flat round icon="delete" color="red" @click="onDeleteRecord"/>
                          <!-- save -->
                          <q-btn flat round icon="save" @click="onSubmit"/>
                        </div>
                      </template>
                    </q-banner>
                    <div class="q-pa-md">
                      <codemirror ref="myCm" id='cmx'
                        v-model="tipitaka.text"
                        :options="cmOptions"
                        v-bind:style="{'padding-top': `${tipitaka.paddingTop}px`}" >
                      </codemirror>
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
import _ from 'lodash'
import { mapGetters } from 'vuex'
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
import { db, storage } from 'src/boot/firebase'
import { showMessage } from 'src/functions/function-show-message'
import timestamp2Datetime from 'src/mixins/filter-timestamp-datetime'
import QFirebaseUploader from 'src/components/Operation/QFirebaseUploader'

export default {
  name: 'operation.digitization',
  mixins: [timestamp2Datetime],
  components: {
    QFirebaseUploader,
    codemirror
  },
  data () {
    return {
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
        max: 10
      },
      // datatable & form
      initialPagination: {
        sortBy: 'pageNumber',
        descending: false,
        rowsPerPage: 10
      },
      tipitakas: [],
      tipitaka: {
        id: '',
        tipitakaEdition: '',
        volumeNumber: '1',
        pageNumber: '1',
        imageReference: '',
        text: '',
        wordBoxs: [],
        paddingTop: 10,
        lineHeight: 20,
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      },
      // codemirror options
      cmOptions: {
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity
      },
      // other
      imagePathReference: ''
    }
  },
  computed: {
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
          classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 300px',
          headerStyle: 'max-width: 250px'
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
        result = this.volumeOptions[this.selectedVolume].pages
      }
      return result
    },
    routeParam () {
      return this.$route.params.id
    },
    codemirror () {
      return this.$refs.myCm.codemirror
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
          this.tipitakaEdition = _.find(tipitakaEditions, ['code', this.routeParam])
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
      const vm = this
      vm.$bind('tipitaka', db.collection('tipitaka').doc(row.id))
        .then(() => {
          // set parameter
          vm.dialog = true
          vm.action = 'update'
          // get image
          storage.ref().child(`${vm.tipitaka.imageReference}`).getDownloadURL()
            .then((url) => {
              vm.imagePathReference = url
            }).catch(error => {
              showMessage('systemMessage.errorTitle', 'systemMessage.error')
              console.log(error)
            })
        })
    },
    onCreateBtnClick () {
      this.dialog = true
      this.action = 'create'

      const vm = this
      vm.pageOptions = _.range(1, vm.totalPagesInSelectedVolume + 1)
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', vm.tipitakaEdition.code)
        .where('volumeNumber', '==', vm.selectedVolume)
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => doc.data())
          const createdPages = _.map(documents, 'pageNumber')
          const filtered = _.filter(vm.pageOptions, function (o) { return !createdPages.includes(o) })
          vm.pageOptions = filtered
          vm.tipitaka = {
            id: '',
            tipitakaEdition: vm.routeParam,
            volumeNumber: vm.selectedVolume,
            pageNumber: vm.pageOptions[0],
            imageReference: '',
            text: '',
            wordBoxs: [],
            paddingTop: 10,
            lineHeight: 20,
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
        if (success) {
          if (vm.action === 'create') {
            db.collection('tipitaka').add({
              tipitakaEdition: vm.tipitaka.tipitakaEdition,
              volumeNumber: vm.tipitaka.volumeNumber,
              pageNumber: vm.tipitaka.pageNumber,
              imageReference: vm.tipitaka.imageReference,
              text: vm.tipitaka.text,
              wordBoxs: vm.tipitaka.wordBoxs,
              paddingTop: vm.tipitaka.paddingTop,
              lineHeight: vm.tipitaka.lineHeight,
              createdOn: vm.$Timestamp.now(),
              createdBy: vm.userName,
              updatedOn: vm.$Timestamp.now(),
              updatedBy: vm.userName
            }).then((docRef) => {
              vm.tipitaka.id = docRef.id
              vm.action = 'update'
              vm.$bind('tipitaka', db.collection('tipitaka').doc(docRef.id))
              this.$firestoreRefs.tipitaka.update({
                id: docRef.id
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
              paddingTop: vm.tipitaka.paddingTop,
              lineHeight: vm.tipitaka.lineHeight,
              updatedOn: vm.$Timestamp.now(),
              updatedBy: vm.userName
            }).then(() => {
              showMessage('systemMessage.infoTitle', 'systemMessage.success')
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
        title: 'Confirm',
        message: 'Would you like to turn on the wifi?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
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
    },
    onDeleteImage () {
      const vm = this
      storage.ref().child(vm.tipitaka.imageReference).delete()
        .then(() => {
          showMessage('systemMessage.infoTitle', 'systemMessage.deleted')
          vm.tipitaka.imageReference = ''
        })
        .catch(error => {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
          console.log(error)
        })
    },
    adjustLineHeight () {
      if (this.tipitaka.lineHeight < 40) {
        document.querySelector('#cmx div.CodeMirror').style.lineHeight = `${this.tipitaka.lineHeight + 0.5}px`
        this.tipitaka.lineHeight += 0.5
      } else {
        document.querySelector('#cmx div.CodeMirror').style.lineHeight = '20px'
        this.tipitaka.lineHeight = 20
      }
    },
    increaseLineHeight () {
      if (this.tipitaka.lineHeight < 40) {
        document.querySelector('#cmx div.CodeMirror').style.lineHeight = `${this.tipitaka.lineHeight + 0.5}px`
        this.tipitaka.lineHeight += 0.5
      }
    },
    decreaseLineHeight () {
      if (this.tipitaka.lineHeight > 20) {
        document.querySelector('#cmx div.CodeMirror').style.lineHeight = `${this.tipitaka.lineHeight - 0.5}px`
        this.tipitaka.lineHeight -= 0.5
      }
    },
    removeExtraSpace () {
      // this.tipitaka.text = this.tipitaka.text.replace(/\s+/g, ' ').trim()
      const splitLines = _.split(this.tipitaka.text, '\n')
      const removeExtraSpaceArray = []
      splitLines.forEach(eachLine => {
        removeExtraSpaceArray.push(eachLine.replace(/\s+/g, ' ').trim())
      })
      this.tipitaka.text = _.join(removeExtraSpaceArray, '\n')
    }
  },
  watch: {
    routeParam () {
      this.loadData()
    },
    'tipitaka.imageReference' () {
      const checkExist = setInterval(() => {
        if (document.querySelector('#cmx div.CodeMirror')) {
          document.querySelector('#cmx div.CodeMirror').style.lineHeight = `${this.tipitaka.lineHeight}px`
          clearInterval(checkExist)
        }
      }, 300)
    },
    pageRange () {
      this.datatableSource()
    }
  },
  created () {
    this.loadData()
  }
}
</script>
