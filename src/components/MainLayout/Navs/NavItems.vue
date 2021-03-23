<template>
  <q-list bordered dark>
    <span
      v-for="nav in navItems"
      :key="nav.label">
      <q-item
        v-if="!nav.title"
        :to="nav.to"
        class="text-white"
        exact-active-class="bg-blue-9 text-white shadow-2"
        clickable
      >
        <q-item-section v-if="nav.icon" avatar>
          <q-icon :name="nav.icon" />
        </q-item-section>

        <q-item-section v-if="nav.caption">
          <q-item-label lines="1">{{ nav.label }}</q-item-label>
          <q-item-label caption>{{ nav.caption }}</q-item-label>
        </q-item-section>
        <q-item-section v-else>
          <q-item-label>{{ $t(nav.label) }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-else
        style="font-size: 1.2em"
        class="q-pt-lg text-yellow-4"
      >
        <q-item-section avatar>
          <q-icon :name="nav.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t(nav.label) }}</q-item-label>
        </q-item-section>
      </q-item>
    </span>
  </q-list>
</template>

<script>
export default {
  props: ['navItems']
}
</script>
