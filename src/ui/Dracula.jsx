var React = require("react");

var Stream = require("../util/audiostream"),
    Clock = require('../mixins/clock'),
    ScanConverter = require('../mixins/scan'),
    D553 = require("../d553"),
    ROMS = require("../roms"),
    Keyboard = require("../util/keyboard");

var Debugger = require("./d553/debugger.jsx"),
    Display = require("./Display.jsx");

module.exports = React.createClass({
    mixins: [Clock(100000), ScanConverter],

    getInitialState: function () {
        var cpu = new D553(ROMS.EPOCH_DRACULA),
            stream = new Stream();

        cpu.scan_hook = this.hook_scan;

        cpu.audio(stream.sampleRate, 100000, this.output_sample);

        return {
            paused: true,
            cpu: cpu,
            audio: stream,
        }
    },

    keychange: function (e, down) {
        switch (e.keyCode) {
        case Keyboard.TAB:
            this.state.cpu.inputs[0] = (this.state.cpu.inputs[0] & ~1) | (down ? 1 : 0);
            break ;
        case Keyboard.SPACE:
            this.state.cpu.inputs[0] = (this.state.cpu.inputs[0] & ~2) | (down ? 2 : 0);
            break ;
        case Keyboard.SHIFT:
            this.state.cpu.inputs[0] = (this.state.cpu.inputs[0] & ~4) | (down ? 4 : 0);
            break ;

        case Keyboard.UP_ARROW:
            this.state.cpu.inputs[1] = (this.state.cpu.inputs[1] & ~1) | (down ? 1 : 0);
            break ;
        case Keyboard.DOWN_ARROW:
            this.state.cpu.inputs[1] = (this.state.cpu.inputs[1] & ~2) | (down ? 2 : 0);
            break ;
        case Keyboard.LEFT_ARROW:
            this.state.cpu.inputs[1] = (this.state.cpu.inputs[1] & ~4) | (down ? 4 : 0);
            break ;
        case Keyboard.RIGHT_ARROW:
            this.state.cpu.inputs[1] = (this.state.cpu.inputs[1] & ~8) | (down ? 8 : 0);
            break ;
        default:
            return ;
        }
        e.preventDefault();
    },

    keyup: function (e) {
        this.keychange(e, false);
    },

    keydown: function (e) {
        this.keychange(e, true);
    },

    output_sample: function (outputs) {
        this.state.audio.output(outputs[8] >> 2);
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
            <Display display="media/EpochDracula.svg" bits={28} gates={this.state.frame} />
        </div> ;
    }
});
