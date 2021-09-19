<template>
  <q-page>
    <!-- toolbar -->
    <q-toolbar class="text-black bg-blue-grey-2">
      <!-- title -->
      <q-toolbar-title class="q-pa-sm">
        <span class="text-overline">{{ tocSetRec.name }}</span>
        <!-- toc menu -->
        <toc-menu
          :selected="selected"
          :selectedArrayIndex="selectedArrayIndex"
          :selectedArrayLastIndex="selectedArrayLastIndex"
          :changeParentStatus="changeParentStatus"
          :hasChildren="hasChildren"
          @onCreateBtnClick="onCreateBtnClick"
          @onEditBtnClick="onEditBtnClick"
          @onUpwardBtnClick="onUpwardBtnClick"
          @onDownwardBtnClick="onDownwardBtnClick"
          @onChangeParent="onChangeParent"
          @onDeleteBtnClick="onDeleteBtnClick"
        />
      </q-toolbar-title>
      <!-- page search setting -->
      <page-finder
        :tipitakaEditionOptions = "tipitakaEditionOptions"
        :volumeOptions = "volumeOptions"
        :totalPagesInSelectedVolume = "totalPagesInSelectedVolume"
        :selectedTipitakaEdition = "selectedTipitakaEdition"
        :selectedVolumeNumber = "selectedVolumeNumber"
        :selectedPageNumber = "selectedPageNumber"
        @onChangeSelectedTipitakaEdition = "onChangeSelectedTipitakaEdition"
        @onChangeSelectedVolumeNumber = "onChangeSelectedVolumeNumber"
        @onChangeSelectedPageNumber = "onChangeSelectedPageNumber"
      >
      </page-finder>

      <!-- expand all node -->
      <q-toggle v-model="expandAll">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.expandAll") }}
        </q-tooltip>
      </q-toggle>

    </q-toolbar>

    <!-- splitter -->
    <q-splitter v-model="splitterModel" style="height: 80vh">

      <!-- left side -->
      <!-- common TOC -->
      <template v-slot:before>
        <div class="q-pa-md q-gutter-sm">
          <!-- filter -->
          <q-input
            ref="filter"
            filled
            v-model="filter"
            :label="$t('systemLabel.filter')"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="clear"
                class="cursor-pointer"
                @click="resetFilter"
              />
            </template>
          </q-input>
          <!-- toc tree -->
          <q-tree
            :nodes="tableOfContent" node-key="id"
            :filter="filter"
            :selected.sync="selected" selected-color="primary"
            :tick-strategy="tickStrategy"
            :ticked.sync="ticked"
            :expanded.sync="expanded"
          />
        </div>
      </template>

      <!-- right slot -->
      <template v-slot:after>
        <q-splitter v-model="insideModel" horizontal>

          <!-- top -->
          <template v-slot:before>
            <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">
              <q-header>
                <q-bar class="bg-blue-grey text-white">
                  <div>{{ archiveDetail }}</div>
                  <q-space />
                  <q-btn
                    v-if="selectedPageNumber > 1"
                    @click="prevPage"
                    round
                    flat
                    icon="arrow_back"
                  />
                  <q-btn
                    v-if="totalPagesInSelectedVolume > selectedPageNumber"
                    @click="nextPage"
                    round
                    flat
                    icon="arrow_forward"
                  />
                </q-bar>
              </q-header>
              <q-page-container>
                <div class="q-pa-md">
                  <q-img
                    v-if="imagePathReference"
                    :src="imagePathReference"
                    spinner-color="white"
                  />
                </div>
              </q-page-container>
            </q-layout>
          </template>

          <!-- buttom -->
          <template v-slot:after>
            <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">

              <!-- header -->
              <q-header elevated>
                <!-- topbar -->
                <top-bar
                  :pageView="pageView"
                  :treeView="treeView"
                  :refresh="refresh"
                  :selected="selected"
                  :selectedTipitakaEdition="selectedTipitakaEdition"
                  :selectedWord="selectedWord"
                  :selectedWordArray="selectedWordArray"
                  :markContentStatus="markContentStatus"
                  @pageViewClick="pageViewClick"
                  @treeViewClick="treeViewClick"
                  @onMarkContent="onMarkContent"
                  @onClearMarkContent="onClearMarkContent"
                />

                <!-- word selection -->
                <q-banner dense inline-actions class="text-blue-4 bg-grey-3">
                  <span class="text-blue-8 text-weight-bolder">{{ $t('commonToc.wordSeqBlock') }}</span>
                  <template v-slot:action>
                    <li
                      v-for="i in _.orderBy(selectedWordArray, 'wordIndex')" :key=i.id
                      class="content-block" flat>
                      <span class="text-blue-12 text-weight-bolder">{{ i.word }}</span>
                      {{ $t('commonToc.volumeNumber') }} {{i.volumeNumber}}
                      {{ $t('commonToc.pageNumber') }} {{i.pageNumber}}
                      <span v-if="_.maxBy(selectedWordArray, 'wordIndex').id != i.id">
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                      </span>
                    </li>
                  </template>
                </q-banner>

              </q-header>

              <!-- page container -->
              <q-page-container>
                <div>
                  <!-- pageView -->
                  <div v-if="pageView" class="q-pa-lg">
                    <div v-for="l in lastLine" :key="l">
                      <q-btn
                        v-for="w in _.filter(wordList, { 'lineNumber': l })"
                        :key="w.wordIndex" flat padding="xs xs" :label="w.word"
                        :id="w.wordIndex"
                        :class="{selectedWord: (w.id === selectedWord) }"
                        @click="onSelectedWord(w.id)"/>
                    </div>
                  </div>
                  <!-- treeView -->
                  <div v-else-if="treeView" class="q-pa-lg">
                    <q-btn
                      v-for="w in contentList"
                      :key="w.id" flat padding="xs xs" :label="w.word"
                      :id="w.wordIndex"
                      :class="{selectedWord: (w.id === selectedWord) }"
                      @click="onSelectedWord(w.id)"
                    />
                    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
                  </div>
                  <!-- refresh -->
                  <div v-else-if="refresh">
                    <q-markup-table v-if="selected" flat bordered>
                      <thead class="bg-grey-4">
                        <tr>
                          <th colspan="3">
                            <div class="text-h6 q-ml-md">{{ selectedObject.label }}</div>
                          </th>
                        </tr>
                        <tr class="bg-grey-2">
                          <td colspan="3">{{ $t('commonToc.tcr') }} : {{ _.join(commonRef,' / ') }} </td>
                        </tr>
                        <tr v-if="wordSeqBlock" class="bg-grey-3">
                          <th class="text-left">{{ _.first(_.filter(tipitakaEditionOptions, { value: 'sya' }))['label'] }}</th>
                          <th class="text-left">{{ $t('commonToc.beginContent') }}</th>
                          <th class="text-left">{{ $t('commonToc.endContent') }}</th>
                        </tr>
                      </thead>
                      <tbody v-if="wordSeqBlock">
                        <tr>
                          <td>{{ $t('commonToc.word') }}</td>
                          <td>{{ wordSeqBlock.content[0].word }}</td>
                          <td>{{ wordSeqBlock.content[1].word }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t('commonToc.volumeNumber') }}</td>
                          <td>{{ wordSeqBlock.content[0].volumeNumber }}</td>
                          <td>{{ wordSeqBlock.content[1].volumeNumber }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t('commonToc.pageNumber') }}</td>
                          <td>{{ wordSeqBlock.content[0].pageNumber }}</td>
                          <td>{{ wordSeqBlock.content[1].pageNumber }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </div>
              </q-page-container>
            </q-layout>
          </template>

        </q-splitter>
      </template>

    </q-splitter>

    <!-- dialog -->
    <q-dialog
      v-model="dialog"
      position="right"
      :maximized="true"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card class="card-dialog-500">
        <q-banner
          inline-actions
          :class="{
            'text-white': true,
            'bg-primary': action == 'update',
            'bg-secondary': action == 'create'
          }"
        >
          <q-icon v-if="action == 'create'" name="add" size="sm" />
          <q-icon v-else name="drive_file_rename_outline" size="sm" />
          {{ $t($options.name) }} : {{ selectedObject.label }}
          <template v-slot:action>
            <q-btn dense flat icon="close" v-close-popup />
          </template>
        </q-banner>

        <q-card-section>
          <q-form
            v-if="commonToc"
            ref="commonTocForm"
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              ref="commonTocFormLable"
              filled autofocus
              v-model="commonToc.label"
              :label="$t('commonToc.label')"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) || $t('systemLabel.requiredField')
              ]"
            />

            <q-input
              v-if="commonToc.createdOn"
              :value="commonToc.createdOn | toDateTime"
              :label="$t('systemLabel.createdOn')"
              readonly
            />

            <q-input
              v-if="commonToc.updatedOn"
              :value="commonToc.updatedOn | toDateTime"
              :label="$t('systemLabel.updatedOn')"
              readonly
            />

            <div align="right">
              <q-checkbox
                v-if="action == 'update'"
                class="q-pr-lg"
                keep-color
                v-model="deleteAction"
                :label="$t('systemLabel.checkToDelete')"
                color="red"
              />

              <q-btn
                :label="$t('systemLabel.submit')"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- sticky menu -->
    <!-- <sticky-menu
      :selected="selected"
      :selectedArrayIndex="selectedArrayIndex"
      :selectedArrayLastIndex="selectedArrayLastIndex"
      :changeParentStatus="changeParentStatus"
      :hasChildren="hasChildren"
      @onCreateBtnClick="onCreateBtnClick"
      @onEditBtnClick="onEditBtnClick"
      @onUpwardBtnClick="onUpwardBtnClick"
      @onDownwardBtnClick="onDownwardBtnClick"
      @onChangeParent="onChangeParent"
      @onDeleteBtnClick="onDeleteBtnClick"
    /> -->

  </q-page>
</template>

<script>
// import { format } from 'quasar'
import { date } from 'quasar'
import { mapState, mapGetters } from 'vuex'
import { db, storage } from 'src/boot/firebase'
import { showMessage } from 'src/functions/function-show-message'
import timestamp2Datetime from 'src/mixins/filter-timestamp-datetime'
import savetoLogbook from 'src/mixins/saveto-logbook'
import PageFinder from 'src/components/Operation/CommonToc/PageFinder'
// import StickyMenu from 'src/components/Operation/CommonToc/StickyMenu'
import TocMenu from 'src/components/Operation/CommonToc/TocMenu'
import TopBar from 'src/components/Operation/CommonToc/TopBar'
import InfiniteLoading from 'vue-infinite-loading'

// const { pad } = format

export default {
  name: 'operation.commonToc',
  mixins: [timestamp2Datetime, savetoLogbook],
  components: {
    PageFinder,
    // StickyMenu,
    TopBar,
    TocMenu,
    InfiniteLoading
  },
  data () {
    return {
      // spliter
      splitterModel: 40,
      insideModel: 25,
      // float menu
      fabPos: [18, 18],
      draggingFab: false,
      // dialog
      dialog: false,
      action: 'create',
      // preview type
      pageView: true,
      treeView: false,
      refresh: false,
      // archive
      tipitakaEditionOptions: [],
      tipitakaEditions: [],
      tipitakaEdition: '',
      volumeOptions: [],
      selectedTipitakaEdition: '',
      selectedVolumeNumber: '',
      selectedPageNumber: 0,
      totalPageOfSelectedVolume: 0,
      selectedTipitakaDoc: [],
      imagePathReference: '',
      // tableOfContent, filter, selection
      tableOfContent: [],
      filter: '',
      expanded: [],
      expandAll: false,
      ticked: [],
      tickStrategy: 'strict',
      selected: null,
      selectedArray: [],
      selectedArrayIndex: 0,
      selectedArrayLastIndex: 0,
      selectedObject: {},
      hasChildren: [],
      contentBeginObject: {},
      contentEndObject: {},
      // data
      commonTocs: [],
      commonRef: [],
      wordList: [],
      lastLine: 0,
      selectedWord: '',
      selectedWordArray: [],
      contentList: [],
      wordSeqBlock: null,
      firstWord: null,
      lastWord: null,
      lastDocSnapshot: null,
      newWordlistCount: 0,
      // data model
      tocSetRec: {
        sequence: '',
        name: '',
        description: '',
        language: '',
        script: ''
      },
      commonToc: {
        tocSetId: '',
        id: '',
        sequence: 0,
        label: '',
        parent: '',
        content: [],
        // log
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    }
  },
  created () {
    // initial necessary data
    this.initialData()
    // bind main data source
    this.bindDataSource()
  },
  computed: {
    ...mapState('auth', ['uid', 'permission']),
    ...mapGetters('auth', ['userName']),
    routeParam () {
      return this.$route.params.id
    },
    totalPagesInSelectedVolume () {
      let result = 100
      if (this.volumeOptions.length) {
        result = this._.find(this.volumeOptions, [
          'value',
          this.selectedVolumeNumber
        ])
      }
      return result.pages
    },
    archiveDetail () {
      if (this.tipitakaEdition) {
        return `${this.tipitakaEdition.name}  ${this.$t(
          'operation.volumeNumber'
        )}  ${this.selectedVolumeNumber} ${this.$t('operation.pages')} ${
          this.selectedPageNumber
        }`
      }
      return ''
    },
    changeParentStatus () {
      if (this.selected) {
        const selectedSet = this.selectedArray[this.selectedArrayIndex]
        // ticked and selectd endpoint
        if (this.ticked.length && this.selected) {
          // is endpoint in ticked array
          if (this.ticked.includes(this.selected)) {
            return false
          }
          // is endpoint is child
          if (this.ticked.includes(selectedSet.parent)) {
            return false
          }
          // is not those case
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    markContentStatus () {
      if (this.selected) {
        if (this.selectedWordArray.length === 2) {
          return true
        } else {
          return false
        }
      }
      return false
    },
    wordSequencesRef () {
      return db.collection('wordSequences')
        .where('commonToc', '==', this.selected)
        .where('tipitakaEdition', '==', this.selectedTipitakaEdition)
    }
  },
  methods: {
    initialData () {
      db.collection('tipitakaEdition')
        .orderBy('sequence')
        .get()
        .then(querySnapshot => {
          // get tipitakaEditionOptions
          this.tipitakaEditionOptions = []
          querySnapshot.forEach(doc => {
            const element = doc.data()
            this.tipitakaEditionOptions.push({
              value: element.code,
              label: `${element.name} ${element.volumes}  ${this.$t(
                'commonToc.volumes'
              )}`
            })
          })
          // get totalVolume and volumeOptions in this Editon
          this.tipitakaEditions = querySnapshot.docs.map(doc => doc.data())
          // selectedTipitakaEdition
          this.selectedTipitakaEdition = this._.first(this.tipitakaEditions).code
          this.tipitakaEdition = this._.find(this.tipitakaEditions, [
            'code',
            this.selectedTipitakaEdition
          ])
          // totalVolume
          this.totalVolume = this.tipitakaEdition.volumes
          this.volumeOptions = []
          this.selectedVolumeNumber = '1'
          this.selectedPageNumber = 1
          // volumeOptions
          this.tipitakaEdition.volume.forEach(element => {
            this.volumeOptions.push({
              value: element.number,
              label: element.number + ') ' + element.name,
              pages: parseInt(element.totalPages)
            })
          })
        })
    },
    bindDataSource () {
      this.$bind(
        'commonTocs',
        db
          .collection('commonToc')
          .where('tocSetId', '==', this.$route.params.id)
      ).then(commonTocs => {
        // get detail record of tocSet
        db.collection('tocSet')
          .doc(this.$route.params.id)
          .get()
          .then(snapshot => {
            this.tocSetRec = snapshot.data()
          })
      })
    },
    loadData () {
      this.tipitakaEdition = this._.find(this.tipitakaEditions, [
        'code',
        this.selectedTipitakaEdition
      ])
      // totalVolume
      this.totalVolume = this.tipitakaEdition.volumes
      this.volumeOptions = []
      this.selectedVolumeNumber = '1'
      // volumeOptions
      this.tipitakaEdition.volume.forEach(element => {
        this.volumeOptions.push({
          value: element.number,
          label: element.number + ') ' + element.name,
          pages: parseInt(element.totalPages)
        })
      })
    },
    retrieveTipitakaData () {
      const vm = this
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', vm.selectedTipitakaEdition)
        .where('volumeNumber', '==', vm.selectedVolumeNumber)
        .where('pageNumber', '==', vm.selectedPageNumber)
        .get()
        .then(querySnapshot => {
          vm.selectedTipitakaDoc = vm._.first(
            querySnapshot.docs.map(doc => doc.data())
          )
          // get image
          storage
            .ref()
            .child(`${vm.selectedTipitakaDoc.imageReference}`)
            .getDownloadURL()
            .then(url => {
              vm.imagePathReference = url
            })
            .catch(error => {
              showMessage('systemMessage.errorTitle', 'systemMessage.error')
              console.log(error)
            })
          // get wordlist
          db.collection('wordlist')
            .where('tipitakaEdition', '==', vm.selectedTipitakaEdition)
            .where('volumeNumber', '==', vm.selectedVolumeNumber)
            .where('pageNumber', '==', vm.selectedPageNumber)
            .orderBy('wordIndex')
            .get()
            .then(querySnapshot => {
              if (querySnapshot.empty) {
                vm.wordList = []
                vm.lastLine = 0
              } else {
                vm.wordList = querySnapshot.docs.map(doc => doc.data())
                vm.lastLine = vm._.last(vm.wordList).lineNumber
              }
            })
        })
    },
    createTOC () {
      const vm = this
      // children tree node
      function childTree (parentId) {
        const childNodes = vm._.filter(vm.commonTocs, { parent: parentId })
        const result = []
        if (childNodes) {
          childNodes.forEach(i => {
            const children = vm._.sortBy(childTree(i.id), 'sequence')
            result.push({
              id: i.id,
              sequence: i.sequence,
              label: i.label,
              children: children
            })
            if (vm.expandAll) {
              vm.expanded.push(i.id)
            }
          })
        }
        return result
      }
      // create table of contents
      vm.tableOfContent = []
      const parentNode = vm._.filter(vm.commonTocs, { parent: null })
      parentNode.forEach(i => {
        const children = vm._.sortBy(childTree(i.id), 'sequence')
        vm.tableOfContent.push({
          id: i.id,
          sequence: i.sequence,
          label: i.label,
          children: children
        })
        if (vm.expandAll) {
          vm.expanded.push(i.id)
        }
      })
      vm.tableOfContent = vm._.sortBy(vm.tableOfContent, 'sequence')
    },
    onCreateBtnClick () {
      this.dialog = true
      this.action = 'create'
      this.deleteAction = false
      this.commonToc = {
        tocSetId: this.$route.params.id,
        id: '',
        sequence: 0,
        label: '',
        parent: '',
        content: [],
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    },
    onEditBtnClick () {
      this.$bind(
        'commonToc',
        db.collection('commonToc').doc(this.selected)
      ).then(() => {
        this.dialog = true
        this.action = 'update'
        this.deleteAction = false
      })
    },
    onUpwardBtnClick () {
      const curr = this.selectedArray[this.selectedArrayIndex]
      const prev = this.selectedArray[this.selectedArrayIndex - 1]
      // update sequence
      db.collection('commonToc')
        .doc(curr.id)
        .update({
          sequence: prev.sequence
        })
        .then(() => {
          console.log('updated!')
        })
      db.collection('commonToc')
        .doc(prev.id)
        .update({
          sequence: curr.sequence
        })
        .then(() => {
          console.log('updated!')
          // re-select node
          this.whenSelected()
        })
      // create table of contents
      this.createTOC()
    },
    onDownwardBtnClick () {
      const curr = this.selectedArray[this.selectedArrayIndex]
      const next = this.selectedArray[this.selectedArrayIndex + 1]
      // update sequence
      db.collection('commonToc')
        .doc(curr.id)
        .update({
          sequence: next.sequence
        })
        .then(() => {
          console.log('updated!')
        })
      db.collection('commonToc')
        .doc(next.id)
        .update({
          sequence: curr.sequence
        })
        .then(() => {
          console.log('updated!')
          // re-select node
          this.whenSelected()
        })
      // create table of contents
      this.createTOC()
    },
    onChangeParent () {
      const batch = db.batch()
      this.ticked.forEach(i => {
        const recRef = db.collection('commonToc').doc(i)
        batch.update(recRef, { parent: this.selected })
      })
      batch.commit().then(() => {
        console.log('commited')
      })
    },
    onDeleteBtnClick () {
      // show dialog massage to confirm
      this.$q.dialog({
        title: this.$t('systemLabel.confirm'),
        message: this.$t('systemLabel.confirmToDelete'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        // update logbook
        this.saveToLogbook('commonToc', 'delete', this.selected, {})
        // delete selected commonToc doc
        db.collection('commonToc')
          .doc(this.selected)
          .delete()
        // delete wordSequences
        this.wordSequencesRef.get()
          .then(wordSequencesRef => {
            if (!wordSequencesRef.empty) {
              this.wordSeqBlock = this._.first(
                wordSequencesRef.docs.map(doc => doc.data())
              )
              db.collection('wordSequences')
                .doc(this.wordSeqBlock.id)
                .delete()
            }
          })
        this.selected = null
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onSubmit () {
      this.$refs.commonTocForm.validate().then(success => {
        if (success) {
          // check state [create, update]
          // create
          if (this.action === 'create') {
            // create timestamp for sequence
            const timeStamp = Date.now()
            // crate new document id and set data to doc
            const newDoc = db.collection('commonToc').doc()
            newDoc
              .set({
                tocSetId: this.commonToc.tocSetId,
                id: newDoc.id,
                sequence: parseInt(date.formatDate(timeStamp, 'x')),
                label: this.commonToc.label,
                parent: this.selected,
                content: [],
                createdOn: this.$Timestamp.now(),
                createdBy: this.userName,
                updatedOn: this.$Timestamp.now(),
                updatedBy: this.userName
              })
              .then(() => {
                this.saveToLogbook('commonToc', 'add', newDoc.id, {
                  label: this.commonToc.label
                })
                this.$refs.commonTocFormLable.$el.focus()
                this.$refs.commonTocFormLable.select()
                showMessage('systemMessage.infoTitle', 'systemMessage.success')
              })
              .catch(error => {
                showMessage('systemMessage.errorTitle', 'systemMessage.error')
                console.log(error)
              })
            // update state
          } else if (this.action === 'update') {
            if (this.deleteAction) {
              this.$firestoreRefs.commonToc.delete()
            } else {
              this.$firestoreRefs.commonToc
                .update({
                  label: this.commonToc.label,
                  updatedOn: this.$Timestamp.now(),
                  updatedBy: this.userName
                })
                .then(() => {
                  this.saveToLogbook(
                    'commonToc',
                    'update',
                    this.$firestoreRefs.commonToc.id,
                    { label: this.commonToc.label }
                  )
                  showMessage(
                    'systemMessage.infoTitle',
                    'systemMessage.success'
                  )
                })
                .catch(error => {
                  showMessage(
                    'systemMessage.errorTitle',
                    'systemMessage.error'
                  )
                  console.log(error)
                })
            }
          }
        } else {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
        }
      })
    },
    async whenSelected () {
      if (this.selected) {
        // get selectedObject
        this.selectedObject = this._.find(this.commonTocs, {
          id: this.selected
        })
        // get selectedArray
        this.selectedArray = this._.sortBy(
          this._.filter(this.commonTocs, {
            parent: this.selectedObject.parent
          }),
          'sequence'
        )
        // selectedArrayIndex
        this.selectedArrayIndex = this._.findIndex(this.selectedArray, {
          id: this.selected
        })
        // selectedArrayLastIndex
        this.selectedArrayLastIndex = this.selectedArray.length - 1
        // hasChildren
        this.hasChildren = this._.filter(this.commonTocs, {
          parent: this.selected
        })
        // await statement
        const wordSequencesRef = await this.wordSequencesRef.get()
        if (!wordSequencesRef.empty) {
          this.wordSeqBlock = this._.first(
            wordSequencesRef.docs.map(doc => doc.data())
          )
        } else {
          this.wordSeqBlock = null
        }
        // commonRef
        if (this.tableOfContent) {
          this.commonRef = this.createCommonRef(this._.first(this.tableOfContent), this.selectedObject.id)
        }
      } else {
        this.selectedObject = {}
        this.selectedArray = []
        this.selectedArrayIndex = 0
        this.selectedArrayLastIndex = 0
        this.wordSeqBlock = null
        this.commonRef = []
      }
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    prevPage () {
      this.selectedPageNumber--
      this.retrieveTipitakaData()
    },
    nextPage () {
      this.selectedPageNumber++
      this.retrieveTipitakaData()
    },
    // settup
    onChangeSelectedTipitakaEdition (value) {
      this.selectedTipitakaEdition = value
      this.whenSelected()
      this.pageView = false
      this.treeView = false
      this.refresh = true
    },
    onChangeSelectedVolumeNumber (value) {
      this.selectedVolumeNumber = value
    },
    onChangeSelectedPageNumber (value) {
      this.selectedPageNumber = value
    },
    pageViewClick () {
      // set status
      this.pageView = true
      this.treeView = false
      this.contentList = []
    },
    treeViewClick (wordSeqBlock) {
      this.wordSeqBlock = wordSeqBlock
      this.firstWord = this.wordSeqBlock.content[0].wordIndex
      this.lastWord = this.wordSeqBlock.content[1].wordIndex
      this.contentList = []
      this.lastDocSnapshot = 0
      // set status
      this.pageView = false
      this.treeView = true
    },
    async fetchWordlist () {
      let wordlistRef = db.collection('wordlist')
        .where('tipitakaEdition', '==', this.selectedTipitakaEdition)
        .where('wordIndex', '>=', `${this.firstWord}`)
        .where('wordIndex', '<=', `${this.lastWord}`)
        .orderBy('wordIndex')
        .limit(400)

      if (this.lastDocSnapshot) {
        wordlistRef = wordlistRef.startAfter(this.lastDocSnapshot)
      }
      const wordlistSnap = await wordlistRef.get()
      this.lastDocSnapshot = wordlistSnap.docs[wordlistSnap.docs.length - 1]
      const result = wordlistSnap.docs.map(p => p.data())
      this.contentList.push(...result)
      return result.length
    },
    async infiniteHandler ($state) {
      this.newWordlistCount = await this.fetchWordlist()
      if (this.newWordlistCount > 0) {
        return $state.loaded() // More records to come
      }
      return $state.complete() // Done with the records
    },
    // mark content
    onMarkContent () {
      const vm = this
      // show dialog massage to confirm
      vm.$q.dialog({
        title: vm.$t('systemLabel.confirm'),
        message: vm.$t('commonToc.markContent'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        // update logbook
        vm.saveToLogbook('commonToc', 'markContent', vm.selected, {})
        // crate new document id and set data to doc
        db.collection('wordSequences')
          .where('commonToc', '==', vm.selected)
          .where('tipitakaEdition', '==', vm.selectedTipitakaEdition)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              const newDoc = db.collection('wordSequences').doc()
              newDoc.set(
                {
                  id: newDoc.id,
                  commonToc: vm.selected,
                  tipitakaEdition: vm.selectedTipitakaEdition,
                  content: vm._.orderBy(vm.selectedWordArray, 'wordIndex')
                }
              ).then(() => {
                // update logbook
                vm.saveToLogbook('commonToc', 'markContent', vm.selected, {})
                showMessage('systemMessage.infoTitle', 'systemMessage.success')
              }).catch(error => {
                showMessage('systemMessage.errorTitle', 'systemMessage.error')
                console.log(error)
              })
            } else {
              const wordSeqBlock = vm._.first(
                querySnapshot.docs.map(doc => doc.data())
              )
              db.collection('wordSequences').doc(wordSeqBlock.id).update({
                content: vm._.orderBy(vm.selectedWordArray, 'wordIndex')
              }).then(() => {
                // update logbook
                vm.saveToLogbook('commonToc', 'markContent', vm.selected, {})
                showMessage('systemMessage.infoTitle', 'systemMessage.success')
              }).catch(error => {
                showMessage('systemMessage.errorTitle', 'systemMessage.error')
                console.log(error)
              })
            }
          })
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onClearMarkContent () {
      // show dialog massage to confirm
      this.$q.dialog({
        title: this.$t('systemLabel.confirm'),
        message: this.$t('commonToc.clearMarkContent'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        // update logbook
        this.saveToLogbook('commonToc', 'clearMarkContent', this.selected, {})
        // update selected doc
        const vm = this
        db.collection('commonToc')
          .doc(this.selected)
          .update({
            'content.begin': '',
            'content.end': ''
          })
          .then(() => {
            vm.selectedWord = null
          })
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    // on selectedWord
    onSelectedWord (id) {
      const vm = this
      // function pushSelectedWord
      function pushSelectedWord (id, lists) {
        function pushAction () {
          const selectedWordObject = vm._.filter(lists, { id: id })[0]
          vm.selectedWordArray.push(selectedWordObject)
        }
        // process
        if (vm.selectedWordArray.length < 2) {
          // < 2 then push a new wordId
          pushAction()
        } else {
          // >= 2 then reset and push a new wordId
          vm.selectedWordArray = []
          pushAction()
        }
      }
      vm.selectedWord = id
      let lists = null
      if (vm.pageView) {
        lists = vm.wordList
      } else {
        lists = vm.contentList
      }
      pushSelectedWord(id, lists)
    },
    // commonRef
    createCommonRef (obj, id) {
      if (obj.id === id) {
        return [obj.label]
      }
      let result = []
      for (const element of obj.children) {
        result = result.concat(this.createCommonRef(element, id))
      }
      if (result.length > 0) {
        result.push(obj.label)
      }
      return result
    }
  },
  // watch
  watch: {
    routeParam () {
      // initial necessary data
      this.initialData()
      // bind main data source
      this.bindDataSource()
    },
    commonTocs () {
      if (this.commonTocs.length) {
        this.createTOC()
      }
    },
    expandAll () {
      this.expanded = []
      this.createTOC()
    },
    selected () {
      this.whenSelected()
      this.pageView = false
      this.treeView = false
      this.refresh = true
    },
    selectedTipitakaEdition () {
      this.loadData()
      this.retrieveTipitakaData()
    },
    selectedVolumeNumber () {
      this.selectedPageNumber = 1
      this.retrieveTipitakaData()
    },
    selectedPageNumber () {
      this.retrieveTipitakaData()
    }
  }
}
</script>

<style scoped>
.pageView {
  color: yellow !important;
}
.treeView {
  color: yellow !important;
}
.selectedWord {
  color: blue !important;
}
.beginContentStatus {
  color: yellow !important;
}
.endContentStatus {
  color: yellow !important;
}
li.content-block {
  display:inline;
}
</style>
