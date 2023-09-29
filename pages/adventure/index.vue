<template>
  <div class="page-background">
    <div 
      class="page-content-area" 
      id="hide-on-scroll-example"
    >
      <div style="width: 100%;display: flex; gap: 24px; justify-content: space-between; margin-top: 24px;" class="simple-header-wrapper">
        <h4 style="color: white; margin: 0; font-weigth: bold">
          Aventura
        </h4>
        <v-select
          style="max-width: 264px; display: flex;align-items: flex-end;"
          dense
          return-object
          v-model="selectedAdventure"
          outlined
          item-text="adventureName"
          item-value="id"
          :items="adventures"
          @input="selectAdventureName"
        />
      </div>
      <div v-if="selectedAdventure" class="course-header">
        <div class="add-user-form">
          <div class="header-content">
            <div class="course-title">
              {{ selectedAdventure.adventureName }}
            </div>
            <div class="course-preview-text">
              {{ selectedAdventure.adventureDescription }}
            </div>
            <!-- <div class="course-long-description">
              <span v-html="selectedAdventure.adventureDescription" />
            </div> -->
            <v-textarea
              label="Notas"
              v-model="adventureData.adventureNotes"
              outlined
            />
          </div>
          <div class="progress-bar">           
            <v-progress-linear
              readonly
              :value="selectedAdventure.progress"
              min="0"
              :max="100"
              height="8px"
              :style="mobile ? 'width:100% !important; margin-top: 8px;' : 'margin-top: 8px;'"
              :color="brand.theme.primary"
              background-color="blue"
              rounded
            />
            <span> {{ parseInt(selectedAdventure.progress * 100 / 100) }}%</span>
          </div>
          <div> 
            <span> Personagens </span>
            <div v-for="character in characters" :key="character.name">
              <span> Nome: {{ character.name }} / </span> 
              <span> Raça {{ character.race }} / </span>
            </div>
          </div>
        </div>
        <div style="padding: 0px 16px;">
          <v-divider style="margin-bottom: 64px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiChevronDown, mdiChevronUp, mdiClose } from "@mdi/js";

export default {
  layout: "arrowHeaderDefault",
  middleware: ["auth-user"],
  components: {
  },
  head() {
    return "Aventura";
  },
  data() {
    return  {
      adventureData: {
        id: 1,
        adventureName: "",
        adventureDescription: "",
        adventureNotes: "",
        adventureImage: null,
        progress: 10
      },
      taskNullIcon: "$taskNullIcon",
      taskTrueIcon: "$taskTrueIcon",
      taskFalseIcon: "$taskFalseIcon",
      selectedTaskIcon: "$selectedTaskIcon",
      mdiChevronDown,
      selectedAdventure: null,
      mobileModuleSelector: false,
      closeIcon: mdiClose,
      mdiChevronUp,
      module: 0
    };
  },
  mounted() {
    console.log(this.adventures);
    /* if(this.$route.query.module === undefined) {
      if (this.$route.query.route === undefined) {
        this.$store.commit("setRedirectPage", "/courses");
        this.asyncRouterPush({
          name: this.$router.history.current.name,
          query: {
            module: 0
          }
        }).then(() => {
          this.module = 0;
        });
      } else {
        this.$store.commit("setRedirectPage", "/courses/admin-courses");
        this.asyncRouterPush({
          name: this.$router.history.current.name,
          query: {
            module: 0,
            route: this.$route.query.route
          }
        }).then(() => {
          this.module = 0;
        });
      }
      
    } else {
      this.module = parseInt(this.$route.query.module);
      if (this.$route.query.route === undefined) {
        this.$store.commit("setRedirectPage", "/courses");
      }
    }
    this.$store.dispatch("courses/loadCourse", this.$route.params.cid).then(() => {
      let faq_index = this.courseModules.findIndex(el => el[0] === "faq");
      if (this.module !== faq_index) this.handleModuleUpdatingOrLoading(faq_index);
      this.handleModuleUpdatingOrLoading(this.module);
    });
    this.$mixpanel.identify(this.user.id);
    this.$mixpanel.track("loadedCourseIndividualPage");
    var u = this.user.id;
    window.onmessage = function(e) {
      if (e.data == "submitTypeForm") {
        window.location.href = "/courses";
        this.$nuxt.$mixpanel.identify(u);
        this.$nuxt.$mixpanel.track("submittedTypeFormResponse");
      }
    }; */
  },
  computed: {
    
    adventures() {
      return this.$store.state.adventure.adventures;
    },
    characters() {
      return this.$store.state.personagens.characters;
    },
    user() {
      return this.$store.state.users.user;
    },
    brand() {
      return this.$store.state.brands.brand;
    },
    mobile() {
      return window.innerWidth > 800 ? false : true;
    }
  },
  methods: {
    selectAdventureName(val) {
      this.adventureData.adventureNotes = val.adventureNotes;
    },
    handleModuleUpdatingOrLoading(idx){
      let mod = this.courseModules[idx][0];
      switch(mod) {
      case "faq":
        this.$store.dispatch("courses/loadCourseQA", this.$route.params.cid).then((r) => {
          this.$store.commit("courses/updateCourseModule", { idx: idx, mod: r.data.length === 0 ? null : r.data, elem: 2 });
          this.$store.commit("courses/updateCourseModule", { idx: idx, mod: true, elem: 3 });
        });
        break;
      case "form":
        var widget = this.course.exam_link.split("?")[0].split("/");
        widget = widget[widget.length - 1];
        this.$store.commit("courses/updateCourseModule", { idx: idx, mod: { widget, hidden: { first_name: this.user.first_name, uid: this.user.id, cid: this.$route.params.cid, last_name: this.user.last_name, email: this.user.email, profile_group: this.user.profile_group.description, store: this.user.store[0].name } }, elem: 2 });
        this.$store.commit("courses/updateCourseModule", { idx: idx, mod: true, elem: 3 });
        break;
      default:
        this.$store.dispatch("courses/loadCourseModule", this.courseModules[idx][0]).then(r => {
          this.$store.commit("courses/updateCourseModule", { idx: idx, mod: r.data, elem: 2 });
          this.$store.commit("courses/updateCourseModule", { idx: idx, mod: true, elem: 3 });
          this.$nextTick(() => this.fitComponents());
        });
      }
    },
    handleChangeSelectedModule(index) {
      if(this.module !== index && this.mobileModuleSelector) this.mobileModuleSelector = false;
      this.module = index;
      this.$router.push({
        name: this.$router.history.current.name,
        query: {
          module: index,
          course_status: this.$route.query.course_status
        }
      });
      this.$mixpanel.identify(this.user.id);
      this.$mixpanel.track("changedSelectedModuleByClickOnCourseIndividualPage");
    },
    getModuleStatus(index) {
      if (index > this.module) return "null";
      else if (index < this.module) return "completed";
      else if (index == this.module) return "selected";
    },
    handleHelpdeskAddTicketRedirect(ticketType) {
      let ticketSubject = "";
      this.$mixpanel.identify(this.user.id);
      switch(ticketType) {
      case 1:
        this.$mixpanel.track("interactedWithDoubtsButtonOnCourseIndividualPage");
        ticketSubject = `Dúvida no módulo "${this.courseModules[this.module][1]}" do treinamento "${this.course.title}"`;
        break;
      case 2:
        this.$mixpanel.track("interactedWithFeedbackCardOnCourseIndividualPage");
        ticketSubject = `Sugestão de melhoria no módulo "${this.courseModules[this.module][1]}" do treinamento "${this.course.title}"`;
        break;
      default:
        break;
      }
      this.$router.push({
        path: "/helpdesk/tickets/add-ticket", 
        query: {
          subject: ticketSubject,
          sector: 1,
          type: ticketType,
          redirect: this.$route.fullPath
        }
      });
    },
    handleAdvanceModule() {
      this.$mixpanel.identify(this.user.id);
      this.$router.push({
        name: this.$router.history.current.name,
        query: {
          module: this.module++,
          course_status: this.$route.query.course_status
        }
      });
      this.$mixpanel.track("changedSelectedModuleByAdvancingOnCourseIndividualPage"); 
    },
    asyncRouterPush(route) {
      return new Promise(resolve => {
        resolve(this.$router.push({ 
          name: route.name,
          query: route.query 
        }));
      });
    },
    fitComponents() {
      var el1 = document.getElementsByClassName("typeform-widget");
      for(var y = 0; y < el1.length; y++){
        el1[y].style.height = "700px";
      }
      var el = document.getElementsByClassName("ql-video");
      for(var i = 0; i < el.length; i++){
        el[i].style.width = "100%";
        el[i].style.height = "60vh";
      }
      var elm_comparison = document.getElementsByClassName("course-preview-text");
      for(var k = 0; k < elm_comparison.length; k++){
        let elm_width = elm_comparison[k].getBoundingClientRect().width;
        let elm_images = elm_comparison[k].getElementsByTagName("img");
        for(var j = 0; j < elm_images.length; j++) {
          elm_images[j].loading = "lazy";
          elm_images[j].style.display = "block";
          elm_images[j].style.margin = "auto";
          elm_images[j].style.justifySelf = "center";
          elm_images[j].style.maxWidth = "100%";
          if(elm_images[j].getBoundingClientRect().width > elm_width){
            elm_images[j].style.width = "100%";
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.crop{
  overflow: hidden;
  height: 30vh;
}
.page-background {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.sector{
  margin-bottom: 16px;
}
.default{
  font-size: 16px;
  line-height: 24px;
  color: darkgray
}
.course-header{
  background-color: white;
  display: flex;
  flex-direction: column;
}
.module-item-title {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #495057;
}
.course-thumbnail{
  width:100%;
  object-fit:cover;
  border-radius: 4px;
}
.course {
  width: 100%;
  align-self: center;
}
:target {
    display: block;
    position: relative;
    top: 100px;
    visibility: hidden;
}
.header-content {
  display: flex;
  flex-direction: column;
}
.v-dialog--fullscreen {
    border-radius: 0;
    margin: 0;
    height: 100%;
    position: fixed;
    overflow-y: auto;
    background: #fff;
    top: 0;
    left: 0;
}
.button-title {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 140%;
}
.banner-title {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 130%;
  letter-spacing: -0.01em;
  color: #495057;
}
.banner-description {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 160%;
  text-align: center;
  color: #868E96;

}
.cancel-save-section {
  background: #ffff;
  display: flex;
  gap: 24px;
  padding: 0px 32px 32px 32px;
  flex-direction: row;
  justify-content: flex-end;
}
.add-user-form{
  background-color: white;
  padding: 32px 32px 0px 32px;
  border-radius: 4px;
  display: grid;
  grid-column-gap: 93px;
  grid-template-columns: calc(2*(100% - 93px)/3) calc(1*(100% - 93px)/3);
}
.modules-holder {
  background-color: white;
  padding: 0px 32px;
  display: grid;
  grid-column-gap: 93px;
  grid-template-columns: calc(2*(100% - 93px)/3) calc(1*(100% - 93px)/3);
}
.bottom-nav-module-title {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: #495057;
}
.edit-goals-button-wrapper {
  display: flex;
  flex-direction: column;
  background: #fff;
}
.progress-bar {
  width: 100%;
  display: flex;
  gap: 12px;
  padding-top: 45px;
  margin: 0px 16px 12px 0px;
  justify-content: flex-end;
  align-items: flex-start;
  }
  .module-radio-title {
  cursor: pointer;
  width: 100%;
  padding: 24px 0px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  }
  .bottom-nav-text {
  font-family: 'Open Sans';
  padding-right: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #868E96;
  }
.modules-title {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 130%;
  color: #868E96;
}
.course-title {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 130%;
  letter-spacing: -0.01em;
  color: #495057;
  margin-bottom: 8px;
}
.module-selector-desktop {
  border: 1px solid #E9ECEF;
  border-radius: 4px;
  padding:24px;
}
.save-button-style {
  text-transform: none !important; color: white; font-weight: normal; width: 176px;
}
.course-preview-text {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 170%;
  color: #868E96;
  margin-bottom: 64px;
}
.course-long-description{
  font-family: "Open Sans";
  font-size: 16px;
  line-height: 24px;
  color: black;
}
.course-long-description * {
  margin: 0 !important;
}
.right-holder {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.course-page{
  width: 70%;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
@media only screen and (max-width: 800px) {
  .course-page {
    width:95%;
  }
  .module-selector-mobile {
  border-radius: 4px;
  padding:24px;
  background: #fff;
  }
  .save-button-style {
 width: 100%;
  }
  .cancel-save-section {
  flex-direction: column;
  gap: 16px;
  }
  .add-user-form {
    background-color: white;
    padding: 32px 32px 0px 32px;
    border-radius: 4px;
    display: flex;
    grid-column-gap: 93px;
    flex-direction: column;
    align-items: flex-end;
  }
  .course-preview-text {
    margin-bottom: 0px;
  }
  .progress-bar {
    width: -webkit-fill-available;
    display: flex;
    gap: 16px;
    margin-bottom: 73px;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .modules-holder {
    background-color: white;
    padding: 0px 16px;
    display: flex;
    flex-direction: column;
  }
  .module-radio-title {
  cursor: pointer;
  width: 100%;
  padding: 24px 0px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  }
  .module-item-title {
    font-size: 14px;
  }
  .module-selector-desktop {
    display: none;
  }
  .banner-mobile {
    border: 1px solid #E9ECEF;
    border-radius: 4px;
    padding:24px;
  }
  .button-title {
    font-size: 15px;
  }
  .banner-title {
    text-align: center;
  }
}
</style>

