import Vue from "vue";
import Vuetify from "vuetify/lib";
//import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#558860",
                secondary: "#E1EDD5",
                thirdColor: "#B0AA5D",
            },
        },
    },
});

export const colorTheme = {
    base: {
        primary: "#558860",
        secondary: "#E1EDD5",
        thirdColor: "#B0AA5D",
    },
    ushui: {
        primary: "#558860",
        secondary: "#E1EDD5",
        thirdColor: "#B0AA5D",
    },
    dark: {
        primary: "#558860",
        secondary: "#E1EDD5",
        thirdColor: "#B0AA5D",
    },
};
