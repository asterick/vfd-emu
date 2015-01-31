var React = require("react");

var Stream = require("../util/audiostream"),
    Clock = require('../mixins/clock'),
    D553 = require("../d553"),
    ROMS = require("../roms");

var Debugger = require("./d553/debugger.jsx");

module.exports = React.createClass({
    mixins: [Clock(100000)],

    getInitialState: function () {
        var cpu = new D553(ROMS.TOMY_ALIEN_CHASE),
            stream = new Stream();

        cpu.scan_hook = this.scan_frame;

        cpu.audio(stream.sampleRate, 100000, this.output_sample);

        return {
            paused: true,
            cpu: cpu,
            audio: stream,
            frame: [0,0,0,0,0,0,0,0,0]
        }
    },

    output_sample: function (outputs) {
        this.state.audio.output((outputs[4] & 2) ? 1 : 0);
    },

    scan_frame: function (data) {
        var select = (data[4] << 8) | (data[3] << 4) | data[2],
            pixels = 0;

        for (var i = 8; i >= 4; i--) {
            pixels = (pixels << 4) | data[i];
        }

        for (var b = 0; b < 9; b++) {
            if ((select >> b) & 1) {
                this.state.frame[b] = pixels;
            }
        }
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

    vfd: function () {
        var styles = {
            display: "block",
            margin: "8px 0",
            textAlign: "center"
        };

        return <div style={styles}>{this.state.frame.map(function (l) {
                var px = [];
                for (var b = 0; b < 20; b++) {
                    var set = (l >> b) & 1,
                        style = {
                            background: set ? "#F00" : "#700",
                            width: "10px",
                            height: "10px",
                            display: "inline-block"
                        };

                    px.push(<div style={style} />);
                }
                return <div style={{ height: "10px" }}>{px}</div>;
            })}</div>;
    },

    render: function () {
        return <div>
            { this.vfd() }

            <Debugger cpu={this.state.cpu} paused={this.state.paused} onToggle={this.toggle} />
        </div> ;
    }
});
