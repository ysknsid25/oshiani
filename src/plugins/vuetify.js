import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                secondary: colors.indigo.darken4,
                likelyRed: colors.red.darken1,
            },
        },
    },
});
