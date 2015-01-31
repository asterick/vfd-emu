var React = require("react");

var Disassembler = require("./disassembler.jsx"),
    RAM = require("./ram.jsx"),
    ROM = require("./rom.jsx"),
    Registers = require("./registers.jsx");

module.exports = React.createClass({
    toggle: function () {
        this.props.onToggle();
    },

    reset: function () {
        this.props.cpu.reset();
        this.forceUpdate();
    },

    step: function () {
        this.props.cpu.step();
        this.forceUpdate();
    },

    render: function () {
        return <div className="D553">
                <div className="column">
                    <Disassembler cpu={this.props.cpu} />
                </div>
                <div className="column">
                    <Registers cpu={this.props.cpu} />
                    <RAM cpu={this.props.cpu} />
                    <ROM cpu={this.props.cpu} />
                    <div className="controls">
                        <button onClick={this.toggle}>{this.props.paused ? "run": "pause"}</button>
                        <button onClick={this.step}>step</button>
                        <button onClick={this.reset}>reset</button>
                    </div>
                </div>
            </div>;
    }
});
