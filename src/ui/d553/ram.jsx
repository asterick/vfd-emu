var React = require("react"),
    table = require("../../d553/table");

module.exports = React.createClass({
    ramlines: function () {
        var lines = [];

        for (var i = 0; i < 0x80; i += 0x10) {
            var bytes = [];
            for (var b = 0; b < 0x10; b++) {
                bytes.push(<span className="ram-byte">{this.props.cpu.ram[i+b].toString(16)}</span>)
            }

            lines.push(<div className="ram-bytes">
                <span className="address">{i.toString(16)}</span>
                {bytes}
            </div>);
        }

        return lines;
    },

    render: function () {
        return <div className="ram-table">
            { this.ramlines() }
        </div>;
    }
})
