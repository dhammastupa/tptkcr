<template>
  <q-bar class="bg-blue-grey text-white q-pa-md">
    <!-- page view -->
    <q-btn
      dense
      icon="article"
      :disabled="pageView"
      :class="{ pageView: pageView }"
      @click="$emit('pageViewClick')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.pageView") }}
      </q-tooltip>
    </q-btn>

    <!-- tree view -->
    <q-btn
      v-if="selected"
      dense
      icon="account_tree"
      :disabled="treeView"
      :class="{ treeView: treeView }"
      @click="treeViewClick"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.treeView") }}
      </q-tooltip>
    </q-btn>

    <q-space />

    <q-btn
      v-if="markContentStatus"
      dense
      icon="format_list_numbered"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.verseNumber") }}
      </q-tooltip>
    </q-btn>

    <q-space />

    <!-- mark content -->
    <q-btn-dropdown
      v-if="selected" dense
      dropdown-icon="settings_ethernet"
      @show="retrieveData"
    >
      <div class="row no-wrap q-pa-md">
        <div class="">
          <div class="q-mb-md">
            <u>{{ $t('commonToc.wordSeqBlock') }}</u>
          </div>
          <div class="q-mb-md">
            <span class="q-pr-sm">{{ $t('commonToc.beginContent') }}:</span>
            <span class="q-pr-sm text-weight-bolder">{{ firstWord }}</span>
            <span class="q-pr-sm">{{ $t('commonToc.volumeNumber') }}:</span>
            <span class="q-pr-sm text-weight-bolder">{{ firstWordVolumeNumber }}</span>
            <span class="q-pr-sm">{{ $t('commonToc.pageNumber') }}:</span>
            <span class="q-pr-sm text-weight-bolder">{{ firstWordPageNumber }}</span>
          </div>
          <div class="q-mb-md">
            <span class="q-pr-sm">{{ $t('commonToc.endContent') }}:</span>
            <span class="q-pr-sm text-weight-bolder">{{ lastWord }}</span>
            <span class="q-pr-sm">{{ $t('commonToc.volumeNumber') }}:</span>
            <span class="q-pr-sm text-weight-bolder">{{ lastWordVolumeNumber }}</span>
            <span class="q-pr-sm">{{ $t('commonToc.pageNumber') }}:</span>
            <span class="q-pr-sm text-weight-bolder">{{ lastWordPageNumber }}</span>
          </div>
          <q-btn
            v-if="markContentStatus"
            color="primary"
            :label="$t('commonToc.markContent')"
            push size="md"
            v-close-popup
            @click="$emit('onMarkContent')"
          />
        </div>
      </div>
    </q-btn-dropdown>
  </q-bar>
</template>

<script>
import { db } from 'src/boot/firebase'
import { showMessage } from 'src/functions/function-show-message'

export default {
  props: [
    'pageView',
    'treeView',
    'refresh',
    'selected', // selected commonTOC
    'selectedTipitakaEdition',
    'selectedWord',
    'selectedWordArray',
    'markContentStatus'
  ],
  data () {
    return {
      wordSeqBlock: [],
      firstWord: null,
      firstWordVolumeNumber: null,
      firstWordPageNumber: null,
      lastWord: null,
      lastWordVolumeNumber: null,
      lastWordPageNumber: null
    }
  },
  computed: {
    wordSequencesRef () {
      return db.collection('wordSequences')
        .where('commonToc', '==', this.selected)
        .where('tipitakaEdition', '==', this.selectedTipitakaEdition)
    }
  },
  methods: {
    async retrieveData () {
      const wordSequencesRef = await this.wordSequencesRef.get()

      if (!wordSequencesRef.empty) {
        this.wordSeqBlock = this._.first(
          wordSequencesRef.docs.map(doc => doc.data())
        )
        this.firstWord = this.wordSeqBlock.content[0].word
        this.lastWord = this.wordSeqBlock.content[1].word
        this.firstWordVolumeNumber = this.wordSeqBlock.content[0].volumeNumber
        this.firstWordPageNumber = this.wordSeqBlock.content[0].pageNumber
        this.lastWordVolumeNumber = this.wordSeqBlock.content[1].volumeNumber
        this.lastWordPageNumber = this.wordSeqBlock.content[1].pageNumber
      } else {
        this.wordSeqBlock = []
        this.firstWord = null
        this.lastWord = null
        this.firstWordVolumeNumber = null
        this.firstWordPageNumber = null
        this.lastWordVolumeNumber = null
        this.lastWordPageNumber = null
      }
    },
    async treeViewClick () {
      const wordSequencesRef = await this.wordSequencesRef.get()

      if (!wordSequencesRef.empty) {
        this.wordSeqBlock = this._.first(
          wordSequencesRef.docs.map(doc => doc.data())
        )
        this.$emit('treeViewClick', this.wordSeqBlock)
      } else {
        this.wordSeqBlock = []
        showMessage('systemMessage.infoTitle', 'systemMessage.noRecordFound')
      }
    }
  },
  watch: {
    selected: {
      immediate: true,
      handler (selected) {
        this.retrieveData()
      }
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
</style>
