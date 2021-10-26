<template>
  <div>
    <!-- <button @click="GetFields">Поля Jira</button> -->
    <div class="row">
      <SelectWithDataVue
        class="col s2 offset-s1"
        :label="'Пространство'"
        :extend="false"
        v-if="projectLoad"
        :list="projectList"
        :option="'naimen'"
        :val="'project'"
        v-model="filter.project"
      />
      <InputWithLabelVue
        class="col s3"
        :icon="'search'"
        :label="'Текст для поиска (enter)'"
        :action="getJira"
        v-model="filter.text"
      />
      <div class="col">
        <PaginationVue
          :pages="Math.ceil(jira.total / jira.maxResults)"
          :step="jira.maxResults"
          :store="{ min: 'jira/resultMin', max: 'jira/resultMax' }"
        />
      </div>
    </div>
    <div class="row center">
      <div v-for="(f, k) in filter" :key="f + k" class="chip">
        {{ k }}: {{ f }}
        <i @click="delFilter(k)" class="material-icons">close</i>
      </div>
    </div>

    <div v-if="loading" class="row center">
      <loadIconVue />
    </div>
    <div v-else class="card">
      <table border="1">
        <caption>
          Всего
          {{
            jira.total
          }}
        </caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Обновлен</th>
            <th>Исполнитель</th>
            <th>ТИП</th>
            <th>Метки</th>
            <th>Проект</th>
            <th>Задача</th>
            <th>Статус</th>
            <th>Автор</th>
            <th>Инфо</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(j, i) in jira.issues">
            <tr
              :key="'t1' + j.id"
              :class="{ 'green lighten-5': ~j.fields.labels.indexOf('отдел') }"
            >
              <td v-html="resultMin + i + 1"></td>
              <td v-html="jiraTime(j.fields.updated)"></td>
              <td v-if="j.fields.assignee">
                <a
                  href=""
                  @click.prevent="setFilter('assignee', j.fields.assignee.key)"
                  v-html="j.fields.assignee.displayName"
                ></a>
              </td>
              <td v-else>Не назначен</td>
              <td>
                <a
                  href=""
                  @click.prevent="
                    setFilter('issuetype', j.fields.issuetype.name)
                  "
                  v-html="j.fields.issuetype.name"
                ></a>
              </td>
              <td>
                <div
                  class="chip"
                  v-for="l in j.fields.labels"
                  @click.prevent="setFilter('labels', l)"
                  :key="j.id + l"
                  v-html="l"
                ></div>
              </td>
              <td>
                <a
                  href=""
                  @click.prevent="setFilter('project', j.fields.project.key)"
                  v-html="j.fields.project.name"
                ></a>
              </td>
              <td>
                <a
                  class="hoverable"
                  target="_blank"
                  :href="'https://jira.ca.sbrf.ru/browse/' + j.key"
                  >{{ j.key }}</a
                >
              </td>
              <td
                :class="
                  j.fields.status.statusCategory.colorName.replace(
                    '-gray',
                    ' lighten-3'
                  )
                "
                class="lighten-3"
              >
                <a
                  class="white"
                  href=""
                  @click.prevent="setFilter('status', j.fields.status.name)"
                  v-html="j.fields.status.name"
                ></a>
              </td>
              <td v-if="j.fields.reporter">
                <a
                  href=""
                  @click.prevent="setFilter('reporter', j.fields.reporter.key)"
                  v-html="j.fields.reporter.displayName"
                ></a>
              </td>
              <td v-else>Нет</td>
              <td v-html="j.fields.summary"></td>
              <td v-html="j.fields.description"></td>
            </tr>
            <tr v-if="j.fields.comment.total" :key="'t2' + j.id">
              <td colspan="8"></td>
              <td>Коментарии</td>
              <td>{{ j.fields.comment.total }}</td>
              <td>
                <div
                  class="row"
                  v-for="c in j.fields.comment.comments"
                  :key="c"
                >
                  <div class="col blue-text yellow">
                    {{ c.author.displayName }}
                  </div>
                  <div class="col" v-html="jiraTime(c.created)"></div>
                  <div class="col s12">{{ c.body }}</div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import InputWithLabelVue from "../components/basic/MUI/InputWithLabel.vue";
import loadIconVue from "../components/basic/MUI/loadIcon.vue";
import SelectWithDataVue from "../components/basic/MUI/SelectWithData.vue";
import PaginationVue from "../components/elements/Pagination.vue";
import moment from "moment";
export default {
  components: {
    loadIconVue,
    PaginationVue,
    SelectWithDataVue,
    InputWithLabelVue
  },
  data() {
    return {
      loading: false,
      projectLoad: false,
      filter: { project: "OPKSSAMDEV", ...this.$route.query }
    };
  },
  computed: {
    ...mapState("jira", [
      "jira",
      "resultMin",
      "resultMax",
      "perPage",
      "projectList"
    ])
  },
  watch: {
    resultMin() {
      this.getJira();
    },
    "filter.project": function() {
      this.getJira();
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    ...mapMutations(["updateState"]),
    setFilter(id, val) {
      this.filter[id] = val;
      if (id === "project") {
        this.newProject(val);
      }
      this.getJira();
    },
    newProject(project) {
      let list = this.projectList;
      let need = list.filter(e => e.project === project).length;
      if (need) {
        return;
      } else {
        let nameProject = this.jira.issues
          .filter(e => e.fields.project.key === project)
          .map(e => e.fields.project.name)[0];
        this.fetchData({
          url: "api/restInsert",
          data: {
            to: "public.jira_projects",
            fields: {
              naimen: nameProject,
              project: project
            }
          }
        }).then(r => {
          if (r.count) {
            this.$M.toast({ html: "Проект сохранен" });
            this.projectLoad = false;
            this.getProjects();
          }
        });
      }
    },
    jiraTime(time) {
      return moment(time).format("DD MMMM YYYY hh:mm:ss");
    },
    delFilter(id) {
      delete this.filter[id];
      this.getJira();
    },

    GetFields() {
      this.fetchData({
        url: "api/JiraTest"
      }).then(r => console.log(r));
    },

    getJira() {
      this.loading = true;

      let jql = "";

      let filter = this.filter;
      let rout = { ...this.$route.query };
      let needPush = false;
      for (const key in filter) {
        if (Object.hasOwnProperty.call(filter, key)) {
          const value = filter[key];
          if (jql) {
            jql += " AND ";
          }
          if (key === "text" && value) {
            jql += key + " ~ '" + value + "'";
          } else {
            jql += key + " in ('" + value + "')";
          }
        }
      }
      jql += " order by updated DESC, labels, assignee, key ASC";
      if (Object.keys(rout).length !== Object.keys(filter).length) {
        needPush = true;
      } else {
        Object.keys(rout).forEach(e => {
          if (rout[e] !== filter[e]) {
            needPush = true;
          }
        });
      }
      if (needPush) {
        this.updateState({ state: "jira/resultMin", data: 0 });
        this.$router.push({ path: "jira", query: { ...filter } });
      }

      this.fetchData({
        url: "api/Jira",
        data: {
          jql,
          startAt: this.resultMin,
          // fields: ['*all'],
          fields: [
            "id",
            "key",
            "comment",
            "assignee",
            "summary",
            "description",
            "reporter",
            "project",
            "issuetype",
            "labels",
            "status",
            "updated"
          ],
          maxResults: this.perPage
        },
        stateName: "jira/jira"
      }).then(() => (this.loading = false));
    },
    getProjects() {
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "jira_projects",
          filter: {
            active: true
          },
          sort: ["naimen"]
        },
        stateName: "jira/projectList"
      }).then(() => (this.projectLoad = true));
    }
  },
  mounted() {
    this.getJira();
    this.getProjects();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
table thead tr {
  color: #ffffff;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
}
table thead tr td {
  border: 1px solid #01ab73;
}
table tbody tr td {
  border: 1px solid #e8e9eb;
}
table tbody tr:nth-child(2n) {
  background: #f4f4f4;
}
table tbody tr:hover {
  background: #ebffe8;
}

td,
th {
  padding: 4px;
  border-left: 1px solid rgba(0, 0, 0, 0.5);
}
.card {
  margin: 0 20px;
}
</style>
