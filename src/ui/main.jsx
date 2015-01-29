var React = require("react"),
    D553 = require("../d553"),
    ROMS = require("../roms");

module.exports = React.createClass({
    mixins: [require('./advance')(400000)],

    getInitialState: function () {
        return {
            processor: new D553(ROMS.EPOCH_DRACULA)
        }
    },

    update: function (t) {
        this.state.processor.step(t);
    },

    render: function () {
        return <div/>;
    }
});
