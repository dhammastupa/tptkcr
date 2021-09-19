<template>
  <span class="q-pa-md q-gutter-sm dense">
    <!-- create node -->
    <q-btn
      round
      size="sm"
      color="white"
      text-color="green"
      icon="add"
      @click="$emit('onCreateBtnClick')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.add") }}
      </q-tooltip>
    </q-btn>
    <!-- edit node -->
    <q-btn
      size="sm"
      round
      v-if="selected"
      color="white"
      text-color="blue"
      icon="edit_note"
      @click="$emit('onEditBtnClick')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.update") }}
      </q-tooltip>
    </q-btn>
    <!-- upward -->
    <q-btn
      size="sm"
      round
      v-if="selected && selectedArrayIndex > 0"
      color="white"
      text-color="blue"
      icon="arrow_upward"
      @click="$emit('onUpwardBtnClick')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.upward") }}
      </q-tooltip>
    </q-btn>
    <!-- downward -->
    <q-btn
      size="sm"
      round
      v-if="selected && selectedArrayIndex < selectedArrayLastIndex"
      color="white"
      text-color="blue"
      icon="arrow_downward"
      @click="$emit('onDownwardBtnClick')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.downward") }}
      </q-tooltip>
    </q-btn>
    <!-- change parent -->
    <q-btn
      size="sm"
      round
      v-if="changeParentStatus"
      color="white"
      text-color="blue"
      icon="escalator_warning"
      @click="$emit('onChangeParent')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.chengeParent") }}
      </q-tooltip>
    </q-btn>
    <!-- delete node -->
    <q-btn
      size="sm"
      round
      v-if="selected && hasChildren.length === 0"
      color="white"
      text-color="red"
      icon="clear"
      @click="$emit('onDeleteBtnClick')"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        {{ $t("commonToc.delete") }}
      </q-tooltip>
    </q-btn>
  </span>
</template>

<script>
export default {
  props: [
    'selected',
    'selectedArrayIndex',
    'selectedArrayLastIndex',
    'changeParentStatus',
    'hasChildren'
  ]
}
</script>
