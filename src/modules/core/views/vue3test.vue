<!--

  vue3test.vue

  Jul 27 2020   Initial
-->
<template>
  <div class="vue3">
    <img src="../../../assets/anonymous.jpg" />
    <div>
      <br>{{Version}}<br>
      This is a Vue3 test in a Vue2 project
    </div>
  </div>
</template>

<script>

export default {
data() {

    return { 
      Version : 'vues3test 1.03, Jul 27 2020'
    }; 
}
};
</script>
