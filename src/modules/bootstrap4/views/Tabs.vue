<!--
  Tabs.vue

  Oct 01 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 03 2019   Grid setup
  Oct 04 2019   Elements positions
  Oct 05 2019   Reorg folders
-->
<template>

  <div class="bootstrap"  id="tabs">
    <b-container>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <img src="../../../assets/bootstrap-vue.png" />
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <div class="identification">
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>{{ msg }}</b-col>
          <b-col cols="2 "></b-col>
        </b-row>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>{{ version }}</b-col>
          <b-col cols="2 "></b-col>
        </b-row>
      </div>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <b-tabs content-class="mt-3">
            <b-tab title="First" active>
              <p>I'm the first tab</p>
            </b-tab>
            <b-tab title="Second">
              <b-nav>
                <b-nav-item active>Active</b-nav-item>
                <b-nav-item>Link</b-nav-item>
                <b-nav-item>Another Link</b-nav-item>
              </b-nav>
            </b-tab>
            <b-tab title="Disabled" disabled>
              <p>I'm a disabled tab!</p>
            </b-tab>
          </b-tabs>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "bootstrap4 tabs widgets",
      version: "tabs 1.11, Oct 05 2019"
    };
  },
  created() {
    this.$parent.disableMenu('tabs');
  },
  beforeDestroy() {
    this.$parent.enableMenu('tabs');
  },
};
</script>
