import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#558866",
                secondary: "#B0AA5D",
                textBaseColor: "#558860",
            },
        },
    },
});

export const colorTheme = {
    base: {
        primary: colors.indigo.darken4,
        secondary: colors.indigo.darken4,
        likelyRed: colors.red.darken1,
    },
    ushui: {
        primary: colors.indigo.darken4,
        secondary: colors.indigo.darken4,
        likelyRed: colors.red.darken1,
    },
    dark: {
        primary: "#558866",
        secondary: "#B0AA5D",
        textBaseColor: "#558860",
    },
};
