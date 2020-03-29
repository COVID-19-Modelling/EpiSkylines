import FormGroupInput from "./Inputs/formGroupInput.vue";

import DropDown from "./Dropdown.vue";
import PaperTable from "./PaperTable.vue";
import Button from "./Button";

import Card from "./Cards/Card.vue";
import ChartCard from "./Cards/ChartCard.vue";
import StatsCard from "./Cards/StatsCard.vue";
import D3Card from "./Cards/D3Card.vue";
import ForestVCard from "./Cards/ForestVCard.vue";
import MarkdownCard from "./Cards/MarkdownCard.vue";
import HtmlCard from "./Cards/HtmlCard.vue";

import SidebarPlugin from "./SidebarPlugin/index";

let components = {
  FormGroupInput,
  Card,
  ChartCard,
  StatsCard,
  PaperTable,
  D3Card,
  MarkdownCard,
  ForestVCard,
  HtmlCard,
  DropDown,
  SidebarPlugin
};

export default components;

export {
  FormGroupInput,
  Card,
  ChartCard,
  StatsCard,
  D3Card,
  ForestVCard,
  MarkdownCard,
  HtmlCard,
  PaperTable,
  DropDown,
  Button,
  SidebarPlugin
};
