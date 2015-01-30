var React = require("react"),
    table = require("../../d553/table");

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            lines: 25
        };
    },

    lines: function () {
        var pc = this.props.cpu.pc,
            that = this;

        function byte () {
            var d = that.props.cpu.rom[pc];
            pc = ((pc+1) & 0xFF) | (pc & ~0xFF);
            return d;
        }

        var lines = [];
        for (var i = 0; i < this.props.lines; i++) {
            var addr = pc,
                data = byte(),
                bytes = [data],
                op = table[data],
                code = op.opcode,
                imm_mask = (1 << op.immediate) - 1;

            while (bytes.length < op.bytes) {
                var v = byte();
                data = (data << 8) | v;
                bytes.push(v);
            }

            if (op.immediate) {
                code += " #" + (data & imm_mask).toString(16).toUpperCase();
            }

            lines.push(<div className="instruction">
                    <span className="address">{addr.toString(16).toUpperCase()}</span>
                    <span className="bytes">
                        { bytes.map(function (b) {
                            return <span className="byte">{b.toString(16).toUpperCase()}</span>;
                        })}
                    </span>
                    <span className="operation">{code}</span>
                </div>);
        }

        return lines;
    },

    render: function () {
        return <div className="dissassembly">
            { this.lines() }
        </div>
    }
})
