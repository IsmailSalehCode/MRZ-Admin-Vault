<template>
  <v-card
    class="mx-auto"
    max-width="550"
    rounded="lg"
    :elevation="mainCardElevation"
  >
    <v-card-title class="toggleableTitle" @click="toggleInfo">
      <v-icon>mdi-information</v-icon>&nbsp;Относно Вашия <b>M.A.V.</b>
    </v-card-title>
    <v-expand-transition>
      <div v-show="expandInfo">
        <hr />
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
          nobis illo recusandae dicta ratione eum doloribus quia beatae ullam
          deserunt perferendis tempora, quis harum a unde omnis enim cupiditate
          pariatur ducimus dolore totam mollitia nostrum repellendus nulla.
          Cumque perspiciatis qui, dolores inventore quaerat aliquam similique
          aspernatur eum harum mollitia ducimus dolorum a laudantium unde
          tempore ea odit quo magnam reiciendis placeat officiis ratione dolore
          obcaecati consectetur? Laboriosam reiciendis ipsum, delectus obcaecati
          nemo numquam velit laborum. Enim quia ullam fugiat blanditiis unde
          beatae eaque quo hic a perferendis? In corporis, provident commodi sed
          dolores natus maxime officia. Unde dolore maxime dolorem?
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      expandInfo: false,
    };
  },
  methods: {
    toggleInfo() {
      this.expandInfo = !this.expandInfo;
    },
  },
  computed: {
    mainCardElevation() {
      const isExpanded = this.expandInfo;
      if (isExpanded) {
        return 8;
      }
      return 2;
    },
  },
};
</script>
<style>
.toggleableTitle {
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.4s;
}
.toggleableTitle:hover {
  background-color: rgb(218, 217, 217);
}
</style>
