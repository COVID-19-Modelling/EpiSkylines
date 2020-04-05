<template>
    <div class="row">
      <b-tabs class="col-12">
        <b-tab title="Tab 1" active>
          <card :title="table1.title" :subTitle="table1.subTitle">
            <div class="table-full-width table-responsive">
              <paper-table :data="table1.data" :columns="table1.columns">

              </paper-table>
            </div>
          </card>
        </b-tab>
        <b-tab title="Tab 2">
          <card  :title="table2.title" :sub-title="table2.subTitle">
            <div class="table-full-width table-responsive">
              <paper-table type="hover" :data="table2.data"
                           :columns="table2.columns">

              </paper-table>
            </div>
          </card>
        </b-tab>
      </b-tabs>
    </div>
</template>
<script>
import { PaperTable } from "@/components";
const tableColumns = ["Id", "Name", "Salary", "Country", "City"];
const tableData = [
  {
    id: 1,
    name: "Dakota Rice",
    salary: "$36.738",
    country: "Niger",
    city: "Oud-Turnhout"
  },
  {
    id: 2,
    name: "Minerva Hooper",
    salary: "$23,789",
    country: "Curaçao",
    city: "Sinaai-Waas"
  },
  {
    id: 3,
    name: "Sage Rodriguez",
    salary: "$56,142",
    country: "Netherlands",
    city: "Baileux"
  },
  {
    id: 4,
    name: "Philip Chaney",
    salary: "$38,735",
    country: "Korea, South",
    city: "Overland Park"
  },
  {
    id: 5,
    name: "Doris Greene",
    salary: "$63,542",
    country: "Malawi",
    city: "Feldkirchen in Kärnten"
  }
];

export default {
  components: {
    PaperTable
  },
  data() {
    return {
      table1: {
        title: "Stripped Table",
        subTitle: "Here is a subtitle for this table",
        columns: [...tableColumns],
        data: [...tableData]
      },
      table2: {
        title: "Table on Plain Background",
        subTitle: "Here is a subtitle for this table",
        columns: [...tableColumns],
        data: [...tableData]
      }
    };
  }
};
</script>
<style>
</style>
