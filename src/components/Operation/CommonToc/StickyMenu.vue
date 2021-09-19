<template>
  <q-page-sticky position="bottom-left" :offset="[18, 18]">
    <q-fab
      color="blue-grey"
      label-position="bottom"
      padding="sm"
      external-label
      icon="menu"
      direction="right"
    >
      <!-- create node -->
      <q-fab-action
        color="white"
        text-color="green"
        padding="sm"
        glossy
        icon="add"
        @click="$emit('onCreateBtnClick')"
      >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.add") }}
        </q-tooltip>
      </q-fab-action>
      <!-- edit node -->
      <q-fab-action
        v-if="selected"
        color="white"
        text-color="blue"
        padding="sm"
        glossy
        icon="edit_note"
        @click="$emit('onEditBtnClick')"
      >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.update") }}
        </q-tooltip>
      </q-fab-action>
      <!-- upward -->
      <q-fab-action
        v-if="selected && selectedArrayIndex > 0"
        color="white"
        text-color="blue"
        padding="sm"
        glossy
        icon="arrow_upward"
        @click="$emit('onUpwardBtnClick')"
      >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.upward") }}
        </q-tooltip>
      </q-fab-action>
      <!-- downward -->
      <q-fab-action
        v-if="selected && selectedArrayIndex < selectedArrayLastIndex"
        color="white"
        text-color="blue"
        padding="sm"
        glossy
        icon="arrow_downward"
        @click="$emit('onDownwardBtnClick')"
      >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.downward") }}
        </q-tooltip>
      </q-fab-action>
      <!-- change parent -->
      <q-fab-action
        v-if="changeParentStatus"
        color="white"
        text-color="blue"
        padding="sm"
        glossy
        icon="escalator_warning"
        @click="$emit('onChangeParent')"
      >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.chengeParent") }}
        </q-tooltip>
      </q-fab-action>
      <!-- delete node -->
      <q-fab-action
        v-if="selected && hasChildren.length === 0"
        color="white"
        text-color="red"
        padding="sm"
        glossy
        icon="clear"
        @click="$emit('onDeleteBtnClick')"
      >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("commonToc.delete") }}
        </q-tooltip>
      </q-fab-action>
    </q-fab>
  </q-page-sticky>
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
