<template>
  <q-btn-dropdown
    flat
    stretch
    text-color="blue-grey"
    :label="$t('commonToc.search')"
  >
    <div class="row no-wrap q-pa-md">
      <!-- เลือกชุด -->
      <div class="column">
        <div class="text-h6 q-mb-md">
          {{ $t("configuration.tipitakaEdition") }}
        </div>
        <q-option-group
          :options="tipitakaEditionOptions"
          type="radio"
          :value="selectedTipitakaEdition"
          @input="onChangeSelectedTipitakaEdition"
        />
      </div>
      <q-separator vertical inset class="q-mx-lg" />
      <!-- เลือกเล่ม -->
      <div class="column">
        <div class="q-pr-sm q-gutter-sm">
          <!-- select volume -->
          <q-select
            flat
            bottom-slots
            :value="selectedVolumeNumber"
            :options="volumeOptions"
            :label="$t('operation.selectVolume')"
            map-options emit-value
            @input="onChangeSelectedVolumeNumber"
          >
          </q-select>
          <!-- select page -->
          <q-slider
            v-model="pageNumber"
            :min="1" :max="totalPagesInSelectedVolume"
            label label-always color="blue-grey"
            :label-value="$t('operation.pages') + ' ' + selectedPageNumber"
          />
        </div>
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
export default {
  props: [
    'tipitakaEditionOptions',
    'volumeOptions',
    'totalPagesInSelectedVolume',
    'selectedTipitakaEdition',
    'selectedVolumeNumber',
    'selectedPageNumber'
  ],
  computed: {
    pageNumber: {
      get () {
        return this.selectedPageNumber
      },
      set (val) {
        this.onChangeSelectedPageNumber(val)
      }
    }
  },
  methods: {
    onChangeSelectedTipitakaEdition (value) {
      this.$emit('onChangeSelectedTipitakaEdition', value)
    },
    onChangeSelectedVolumeNumber (value) {
      this.$emit('onChangeSelectedVolumeNumber', value)
    },
    onChangeSelectedPageNumber (value) {
      this.$emit('onChangeSelectedPageNumber', value)
    }
  }
}
</script>
