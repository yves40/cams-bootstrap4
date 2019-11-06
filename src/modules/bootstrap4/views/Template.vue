<!--
  Template.vue

  Oct 04 2019   Initial
  Oct 05 2019   Add text
  Oct 11 2019   More text to scroll
-->
<template>
  <div class="bootstrap" id="template">
      <b-container>
        <!-- 
          Optional image.
        -->
        <div class="viewframe">
          <b-row>
            <b-col cols="2"></b-col>
            <b-col>
              <img src="../../../assets/bootstrap-vue.png" />
            </b-col>
            <b-col cols="2"></b-col>
          </b-row>
        </div>
        <!-- 
          Optional version and screen info.
        -->
        <div class="identification viewframe">
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
        <!-- 
          Application zone.
        -->
        <div class="viewframe">
          <b-row>
            <b-col cols="2"></b-col>
            <b-col>
              <div>
                <p>Here comes the application zone</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum rem dignissimos illum distinctio in, nesciunt, doloribus, ab optio et numquam dolore praesentium perferendis placeat necessitatibus. Harum, voluptates odit ipsam quas aut soluta, a amet natus vitae tenetur sapiente. Magni nulla culpa animi. Mollitia placeat, corporis aperiam soluta saepe porro delectus harum voluptates rerum? Id nihil modi ipsa sunt velit obcaecati ex illum nemo nesciunt eos rem consequatur nobis quae aperiam facilis tempore laudantium saepe minima, amet dicta soluta dolores? Voluptas officiis quod, molestias veniam eum quasi consequuntur voluptatum, dicta sequi modi in sit blanditiis nostrum similique, doloribus amet explicabo a!</p>
                <p>Do whatever you want into this zone</p>
              </div>              
              <div>
                <p>Here comes the application zone</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum rem dignissimos illum distinctio in, nesciunt, doloribus, ab optio et numquam dolore praesentium perferendis placeat necessitatibus. Harum, voluptates odit ipsam quas aut soluta, a amet natus vitae tenetur sapiente. Magni nulla culpa animi. Mollitia placeat, corporis aperiam soluta saepe porro delectus harum voluptates rerum? Id nihil modi ipsa sunt velit obcaecati ex illum nemo nesciunt eos rem consequatur nobis quae aperiam facilis tempore laudantium saepe minima, amet dicta soluta dolores? Voluptas officiis quod, molestias veniam eum quasi consequuntur voluptatum, dicta sequi modi in sit blanditiis nostrum similique, doloribus amet explicabo a!</p>
                <p>Do whatever you want into this zone</p>
              </div>              
              <div>
                <p>Here comes the application zone</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum rem dignissimos illum distinctio in, nesciunt, doloribus, ab optio et numquam dolore praesentium perferendis placeat necessitatibus. Harum, voluptates odit ipsam quas aut soluta, a amet natus vitae tenetur sapiente. Magni nulla culpa animi. Mollitia placeat, corporis aperiam soluta saepe porro delectus harum voluptates rerum? Id nihil modi ipsa sunt velit obcaecati ex illum nemo nesciunt eos rem consequatur nobis quae aperiam facilis tempore laudantium saepe minima, amet dicta soluta dolores? Voluptas officiis quod, molestias veniam eum quasi consequuntur voluptatum, dicta sequi modi in sit blanditiis nostrum similique, doloribus amet explicabo a!</p>
                <p>Do whatever you want into this zone</p>
              </div>              
            </b-col>
          </b-row>
        </div>
      </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "Template for application screens",
      version: "Template 1.02, Oct 05 2019"
    };
  },
  created() {
    this.$parent.disableMenu('template');
  },
  beforeDestroy() {
    this.$parent.enableMenu('template');
  },
};
</script>
