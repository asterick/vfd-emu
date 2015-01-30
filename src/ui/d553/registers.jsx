var React = require("react");

module.exports = React.createClass({
    render: function () {
        var cpu = this.props.cpu;

        return <div className="registers">
            <div className="stack">
                <div className="pc">{cpu.pc_set[(cpu.sp-0) & 0x3].toString(16).toUpperCase()}</div>
                <div className="pc">{cpu.pc_set[(cpu.sp-1) & 0x3].toString(16).toUpperCase()}</div>
                <div className="pc">{cpu.pc_set[(cpu.sp-2) & 0x3].toString(16).toUpperCase()}</div>
                <div className="pc">{cpu.pc_set[(cpu.sp-3) & 0x3].toString(16).toUpperCase()}</div>
            </div>
            <div className="values">
                <div className="register">
                    <label>Acc</label><span>{cpu.acc.toString(16).toUpperCase()}</span>
                    <label>TC</label><span>{cpu.tc}</span>
                </div>

                <div className="register">
                    <label>DPh</label><span>{cpu.dp_h.toString(16).toUpperCase()}</span>
                    <label>DPl</label><span>{cpu.dp_l.toString(16).toUpperCase()}</span>
                </div>
                <div className="register">
                    <label>W</label><span>{cpu.w.toString(16).toUpperCase()}</span>
                    <label>Z</label><span>{cpu.z.toString(16).toUpperCase()}</span>
                </div>

                <div className="register">
                    <label>X</label><span>{cpu.x.toString(16).toUpperCase()}</span>
                    <label>R</label><span>{cpu.r.toString(16).toUpperCase()}</span>
                </div>

                <div className="register">
                    <label>S</label><span>{cpu.s.toString(16).toUpperCase()}</span>
                    <label>Y</label><span>{cpu.y.toString(16).toUpperCase()}</span>
                </div>

                <div className="register">
                    <label>Flag</label><span>{cpu.flag.toString(16).toUpperCase()}</span>
                </div>
            </div>
            <div className="flags">
                <div className="flag">
                    <label>C</label><span className="checkbox" data-checked={cpu.carry_ff}/>
                    <label>C&apos;</label><span className="checkbox" data-checked={cpu.carry_s_ff}/>
                </div>
                <div className="flag">
                    <label>INT</label><span className="checkbox" data-checked={cpu.int_ff}/>
                    <label>IE</label><span className="checkbox" data-checked={cpu.ie_ff}/>
                </div>
                <div className="flag">
                    <label>TIM</label><span className="checkbox" data-checked={cpu.tim_ff}/>
                </div>
            </div>
        </div>

        // TODO: FLAGS!
        // TODO: TIMER!
    }
})
