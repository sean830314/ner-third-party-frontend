<template>
  <div class="container">
    <el-main>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="paragraph" prop="paragraph">
          <el-input type="textarea" v-model="ruleForm.paragraph"></el-input>
        </el-form-item>
        <el-form-item label="start id" style="width: 10%" prop="start_id">
          <el-input type="text" v-model="ruleForm.start_id"></el-input>
        </el-form-item>
        <el-form-item label="end id" style="width: 10%" prop="end_id">
          <el-input type="text" v-model="ruleForm.end_id"></el-input>
        </el-form-item>
        <el-form-item label="model type" prop="model_type">
          <el-radio-group v-model="ruleForm.model_type">
            <el-radio label="IDOX.AI"></el-radio>
            <el-radio label="Azure"></el-radio>
            <el-radio label="NLTK"></el-radio>
            <el-radio label="Spacy"></el-radio>
            <el-radio label="Stanford_CoreNLP"></el-radio>
            <el-radio label="All"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="false" @click="recognize('ruleForm')"
            >Recognize</el-button
          >
          <el-button type="primary" :loading="false" @click="annotate('ruleForm')"
            >Annotate</el-button
          >
          <el-button type="danger" @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
      <el-card>
        <el-tabs type="border-card">
          <el-tab-pane label="Annotated result" :data="link" name="Annotated result">
          <a id="annotated_download_link" download target="_blank" :href="link" style="visibility:hidden" download="">Download link</a>
          </el-tab-pane>
          <el-tab-pane label="Recognized Result" name="Recognized Result">
            <el-table :data="ner.tableData" stripe style="width: 100%">
              <el-table-column v-for="{ prop, label } in ner.tableColConfigs" :key="prop" :prop="prop" :label="label">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "ner",
  data() {
    return {
      ruleForm: {
        paragraph: "",
        model_type: "",
        start_id: "",
        end_id: "",
      },
      rules: {
        paragraph: [
          {
            required: false,
            message: "please input a paragraph",
            trigger: "blur",
          },
        ],
        model: [
          {
            required: true,
            message: "please choose a model type",
            trigger: "change",
          },
        ],
      },
      link: "",
      ner: {
      },
    };
  },
  methods: {
    renderTableResult(ner) {
      this.$data.ner = ner;
    },
    renderDownloadLink(link) {
      this.$data.link = link;
      document.getElementById("annotated_download_link").style.visibility="visible";
    },
    recognize(formName) {
      const loadingObj=this.$loading({
        lock:true,
        text:"Submit...",
        spinner:"el-icon-loading",
        background:"rgba(0,0,0,0.5)",
        target:document.querySelector(".submit-test-dialog")
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            const formData = {
              model_type: this.$data.ruleForm.model_type,
              paragraph: this.$data.ruleForm.paragraph,
            };
            axios
              .post("/api/recognize", formData)
              .then((response) => {
                this.renderTableResult(response.data.ner);
                loadingObj.close();
              })
              .catch(function (error) {
                alert(error);
              });
            console.log(this.$data.ner);
          } catch (e) {
            alert(e);
            this.$message({
              message: `Something went wrong. ${JSON.stringify(e)}`,
              type: "error",
            });
            loadingObj.close();
          }
        } else {
          console.log("error submit!!");
          loadingObj.close();
          return false;
        }
      });
    },
    annotate(formName) {
      const loadingObj=this.$loading({
        lock:true,
        text:"Submit...",
        spinner:"el-icon-loading",
        background:"rgba(0,0,0,0.5)",
        target:document.querySelector(".submit-test-dialog")
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            const formData = {
              model_type: this.$data.ruleForm.model_type,
              labelstudio_ids: Array(parseInt(this.$data.ruleForm.end_id, 10) - parseInt(this.$data.ruleForm.start_id, 10)+1).fill().map((_, idx) => parseInt(this.$data.ruleForm.start_id, 10) + idx),
            };
            axios
              .post("/api/annotate", formData)
              .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
                this.renderDownloadLink(url);
                loadingObj.close();
              })
              .catch(function (error) {
                alert(error);
              });
            console.log(this.$data.ner);
          } catch (e) {
            alert(e);
            this.$message({
              message: `Something went wrong. ${JSON.stringify(e)}`,
              type: "error",
            });
            loadingObj.close();
          }
        } else {
          console.log("error submit!!");
          loadingObj.close();
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$data.ner={};
      this.$data.link="";
      document.getElementById("annotated_download_link").style.visibility="hidden";
    },
  },
};
</script>

<style>
.container {
  min-width: 1000px;
  margin: 0 auto;
  position: relative;

  .el-carousel__container {
    height: 700px;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
}
</style>
