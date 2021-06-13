<script>
import { Radar } from "vue-chartjs";

export default {
  extends: Radar,
  props: ["labels", "datas", "whatIndicate"],
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: this.whatIndicate,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: this.datas,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
      }
    );
  },
};
</script>