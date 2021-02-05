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
        <el-form-item label="model type" prop="model">
          <el-radio-group v-model="ruleForm.model">
            <el-radio label="Azure"></el-radio>
            <el-radio label="NLTK"></el-radio>
            <el-radio label="Spacy"></el-radio>
            <el-radio label="Stanford_CoreNLP"></el-radio>
            <el-radio label="All"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >Recognize</el-button
          >
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
      <el-card>
        <el-tabs type="border-card">
          <el-tab-pane label="Result" name="Result">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="model" label="model" width="180">
              </el-table-column>
              <el-table-column label="Organization" width="700">
                <div
                  v-if="scope.row.organization.length > 0"
                  slot-scope="scope"
                >
                  <div
                    v-for="(organization, index) in scope.row.organization"
                    :key="`${scope.row.organization}-example-${index}`"
                  >
                    <span
                      style="margin-right: 18px; color: red; font-size: 18px"
                      >{{ index + 1 }}. {{ organization }}</span
                    >
                  </div>
                </div>
              </el-table-column>
              <el-table-column label="Address" width="700">
                <div v-if="scope.row.address.length > 0" slot-scope="scope">
                  <div
                    v-for="(address, index) in scope.row.address"
                    :key="`${scope.row.address}-example-${index}`"
                  >
                    <span
                      style="margin-right: 18px; color: red; font-size: 18px"
                      >{{ index + 1 }}. {{ address }}</span
                    >
                  </div>
                </div>
              </el-table-column>
              <el-table-column label="Date" width="180">
                <div v-if="scope.row.date.length > 0" slot-scope="scope">
                  <div
                    v-for="(date, index) in scope.row.date"
                    :key="`${scope.row.date}-example-${index}`"
                  >
                    <span
                      style="margin-right: 18px; color: red; font-size: 18px"
                      >{{ index + 1 }}. {{ date }}</span
                    >
                  </div>
                </div>
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
        model: "",
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
      tableData: [],
    };
  },
  methods: {
    renderResult(tableData) {
      console.log("ininder");
      console.log(tableData);
      this.$data.tableData = tableData;
    },
    submitForm(formName) {
      var responseData;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert(this.$data.ruleForm.paragraph);
          alert(this.$data.ruleForm.model);
          try {
            var responseData = [];
            const formData = {
              model: this.$data.ruleForm.model,
              paragraph: this.$data.ruleForm.paragraph,
            };
            axios
              .post("/api", formData)
              .then((response) => {
                console.log(response.data.tableData);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
                alert("success");
                this.renderResult(response.data.tableData);
              })
              .catch(function (error) {
                alert("error");
                alert(error);
              });
            console.log(this.$data.tableData);
          } catch (e) {
            alert(e);
            this.$message({
              message: `Something went wrong. ${JSON.stringify(e)}`,
              type: "error",
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
        alert("submit!");
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
