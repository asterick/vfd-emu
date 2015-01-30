var React = require("react"),
    D553 = require("../d553"),
    ROMS = require("../roms");

var Disassembler = require("./d553/disassembler.jsx"),
    RAM = require("./d553/ram.jsx"),
    ROM = require("./d553/rom.jsx"),
    Registers = require("./d553/registers.jsx"),
    Clock = require('../mixins/clock');

module.exports = React.createClass({
    mixins: [Clock(100000)],

    getInitialState: function () {
        return {
            paused: true,
            processor: new D553(ROMS.EPOCH_DRACULA)
        }
    },

    update: function (t) {
        if (!this.state.paused) {
            this.state.processor.clock(t);
            this.forceUpdate();
        }
    },

    toggle: function () {
        this.setState({
            paused: !this.state.paused
        });
    },

    reset: function () {
        this.state.processor.reset();
        this.forceUpdate();
    },

    step: function () {
        this.state.processor.step();
        this.forceUpdate();
    },

    outputs: function () {
        var out = "";
        for (var p = 2; p < 9; p++) {
            for (var b = 0; b < 4; b++) {
                out += (this.state.processor.input(p) >> b) & 1;
            }
        }

        var styles = {
            display: "block",
            margin: "8px 0",
            textAlign: "center"
        };

        return <div style={styles}>{out}</div>;
    },

    render: function () {
        return <div className="D553">
                <div className="column">
                    <Disassembler cpu={this.state.processor} />
                </div>
                <div className="column">
                    <Registers cpu={this.state.processor} />
                    <RAM cpu={this.state.processor} />
                    <ROM cpu={this.state.processor} />
                    <div className="controls">
                        <button onClick={this.toggle}>{this.state.paused ? "run": "pause"}</button>
                        <button onClick={this.step}>step</button>
                        <button onClick={this.reset}>reset</button>
                    </div>
                    { this.outputs() }
                </div>
            </div> ;
    }
});
