var React = require('react'),
    ISVG = require('react-inlinesvg');

module.exports = React.createClass({
    _toggle: function () {
        this.props.gates.forEach(function (mask, i) {
            for (var b = 0; b < 18; b++) {
                var panel = document.querySelector(".Gate" + i + " .Glyph" + b);

                if (!panel) { continue ; }


                panel.style.display = (mask & (1 << b)) ? "" : "none";
            }
        })
    },

    componentDidUpdate: function () {
        this._toggle();
    },

    render: function () {
        return <div className="vfd">
            <ISVG src={this.props.display} />
        </div>
    }
});
