var React = require('react'),
    ISVG = require('react-inlinesvg');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            bits: 28
        };
    },

    _toggle: function () {
        var node = this.getDOMNode(),
            bits = this.props.bits;

        this.props.gates.forEach(function (mask, i) {
            for (var b = 0; b < bits; b++) {
                Array.prototype.forEach.call(node.querySelectorAll(".grid" + i + " .plate" + b), function (panel) {
                    panel.style.display = (mask & (1 << b)) ? "" : "none";
                });
            }
        })
    },

    componentDidUpdate: function () {
        this._toggle();
    },

    raw: function () {
        return this.props.gates.map(function (mask, i) {
            var bits = [];

            for (var i = 0; i < 28; i++) {
                bits.push(<div style={{
                    background: (((mask >> i) & 1) ? "#F00" : "#800"),
                    width: "16px",
                    height: "16px",
                    display: "inline-block"
                }} />);
            }

            return <div style={{ height: "16px" }}>{bits}</div>;
        })
    },

    render: function () {
        return <div className="vfd">
            { this.props.debug ? this.raw() : <ISVG className="regular" src={this.props.display} /> }
        </div>
    }
});
