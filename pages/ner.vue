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
        <el-form-item label="model type" prop="model_type">
          <el-radio-group v-model="ruleForm.model_type">
            <el-radio label="Azure"></el-radio>
            <el-radio label="NLTK"></el-radio>
            <el-radio label="Spacy"></el-radio>
            <el-radio label="Stanford_CoreNLP"></el-radio>
            <el-radio label="All"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="false" @click="submitForm('ruleForm')"
            >Recognize</el-button
          >
          <el-button type="danger" @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
      <el-card>
        <el-tabs type="border-card">
          <el-tab-pane label="Result" name="Result">
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
      },
      rules: {
        paragraph: [
          {
            required: true,
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
      ner: {
      },
    };
  },
  methods: {
    renderResult(ner) {
      this.$data.ner = ner;
    },
    submitForm(formName) {
      const loadingObj=this.$loading({
        lock:true,
        text:"Submit...",
        spinner:"el-icon-loading",
        background:"rgba(0,0,0,0.5)",
        target:document.querySelector(".submit-test-dialog")
      })
      var responseData;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            var responseData = [];
            const formData = {
              model_type: this.$data.ruleForm.model_type,
              paragraph: this.$data.ruleForm.paragraph,
            };
            axios
              .post("/api", formData)
              .then((response) => {
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
                this.renderResult(response.data.ner);
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
