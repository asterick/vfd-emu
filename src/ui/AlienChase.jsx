var React = require("react");

var Stream = require("../util/audiostream"),
    Clock = require('../mixins/clock'),
    ScanConverter = require('../mixins/scan'),
    D553 = require("../d553"),
    ROMS = require("../roms");

var Debugger = require("./d553/debugger.jsx"),
    Display = require("./Display.jsx");

module.exports = React.createClass({
    mixins: [Clock(100000), ScanConverter],

    getInitialState: function () {
        var cpu = new D553(ROMS.TOMY_ALIEN_CHASE),
            stream = new Stream();

        cpu.scan_hook = this.hook_scan;

        cpu.audio(stream.sampleRate, 100000, this.output_sample);

        return {
            paused: true,
            cpu: cpu,
            audio: stream
        }
    },

    output_sample: function (outputs) {
        this.state.audio.output((outputs[4] & 2) ? 1 : 0);
    },

    update: function (t) {
        if (!this.state.paused) {
            this.state.cpu.clock(t);
            this.forceUpdate();
        }
    },

    toggle: function () {
        this.setState({
            paused: !this.state.paused
        });
    },

    render: function () {
        return <div>
            <Debugger cpu={this.state.cpu} paused={this.state.paused} onToggle={this.toggle} />
            <Display display="media/AlienChase.svg" debug={true} bits={28} gates={this.state.frame} />
        </div> ;
    }
});
