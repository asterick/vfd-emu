var React = require("react");

var Dracula = require("../machine/dracula");

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
            game: new Dracula()
        }
    },

    update: function (t) {
        if (!this.state.paused) {
            this.state.game.tick(t);
            this.forceUpdate();
        }
    },

    toggle: function () {
        this.setState({
            paused: !this.state.paused
        });
    },

    reset: function () {
        this.state.game.cpu.reset();
        this.forceUpdate();
    },

    step: function () {
        this.state.game.cpu.step();
        this.forceUpdate();
    },

    outputs: function () {
        var out = "";
        for (var p = 2; p < 9; p++) {
            for (var b = 0; b < 4; b++) {
                out += (this.state.game.cpu.input(p) >> b) & 1;
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
                    <Disassembler cpu={this.state.game.cpu} />
                </div>
                <div className="column">
                    <Registers cpu={this.state.game.cpu} />
                    <RAM cpu={this.state.game.cpu} />
                    <ROM cpu={this.state.game.cpu} />
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
