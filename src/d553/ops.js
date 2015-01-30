module.exports = {
    // ---- Load ----
    LM: function(imm) {
        debugger ;
        this.acc = this.ram[this.dp];
        this.dp_h ^= imm;
    },
    LDI: function(imm) {
        debugger ;
        this.dp = imm;
    },
    LI: function (imm) {
        debugger ;
        if (this.prev_op & 0xF0 !== 0x90) {
            this.acc = imm;
        }
    },
    LDZ: function (imm) {
        debugger ;
        this.dp = imm;
    },

    // ---- Store ----
    S: function(imm) {
        debugger;
        this.ram[this.dp] = this.acc;
    },

    // ---- Transfer ----
    TAL: function(imm) {
        debugger;
        this.dp_l = this.acc;
    },
    TLA: function(imm) {
        debugger;
        this.acc = this.dp_l;
    },
    TAW: function(imm) {
        debugger;
        this.w = this.acc;
    },
    TAZ: function(imm) {
        debugger;
        this.z = this.acc;
    },
    THX: function(imm) {
        debugger;
        this.x = this.dp_h;
    },
    TLY: function(imm) {
        debugger;
        this.y = this.dp_l;
    },

    // ---- Exchange ----
    XM: function(imm) {
        debugger;
        temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[dp] = temp;
        this.dp_h ^= imm;
    },
    XMI: function(imm) {
        debugger;
        temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[dp] = temp;
        this.dp_h ^= imm;

        this.dp_l = (this.dp_l + 1) & 0xF;
        if (!this.dp_l) {
            this.skip();
        }
    },
    XMD: function(imm) {
        debugger;
        temp = this.acc;
        this.acc = this.ram[this.dp];
        this.ram[dp] = temp;
        this.dp_h ^= imm;

        this.dp_l = (this.dp_l - 1) & 0xF;
        if (this.dp_l === 0xF) {
            this.skip();
        }
    },
    XAW: function(imm) {
        debugger;
        temp = this.acc;
        this.acc = this.w;
        this.w = temp;
    },
    XAZ: function(imm) {
        debugger;
        temp = this.acc;
        this.acc = this.z;
        this.z = temp;
    },
    XHR: function(imm) {
        debugger;
        temp = this.dp_h;
        this.dp_h = this.r;
        this.r = temp;
    },
    XHX: function(imm) {
        debugger;
        temp = this.dp_h;
        this.dp_h = this.x;
        this.x = temp;
    },
    XLS: function(imm) {
        debugger;
        temp = this.dp_l;
        this.dp_l = this.s;
        this.s = temp;
    },
    XLY: function(imm) {
        debugger;
        temp = this.dp_l;
        this.dp_l = this.y;
        this.y = temp;
    },
    XC: function(imm) {
        debugger;
        temp = this.carry_s_ff;
        this.carry_s_ff = this.carry_ff;
        this.carry_ff = temp;
    },

    // ---- Arithmatic ----
    AD: function(imm) {
        debugger;
        this.acc += this.ram[this.dp];
        if (this.acc > 0xF) {
            this.acc &= 0xF;
            this.skip();
        }
    },
    ADC: function(imm) {
        debugger;
        this.acc += this.ram[this.dp] + (this.carry_ff ? 1 : 0);
        if (thos.acc > 0xF) {
            this.acc &= 0xF;
            this.carry_ff = true;
        }
    },
    ADS: function(imm) {
        debugger;
        this.acc += this.ram[this.dp] + (this.carry_ff ? 1 : 0);
        if (thos.acc > 0xF) {
            this.acc &= 0xF;
            this.carry_ff = true;
            this.skip();
        }
    },
    DAA: function(imm) {
        debugger;
        this.acc = (this.acc + 6) & 0xF;
    },
    DAS: function(imm) {
        debugger;
        this.acc = (this.acc + 10) & 0xF;
    },

    // ---- Logical ----
    EXL: function(imm) {
        debugger;
        this.acc ^= this.dp_l;
    },

    // ---- Accumulator ----
    CMA: function(imm) {
        debugger;
        this.acc ^= 0xF;
    },
    CIA: function(imm) {
        debugger;
        this.acc = (~this.acc + 1) & 0xF;
    },
    RAR: function(imm) {
        debugger;
        temp = this.acc;
        this.carry_ff = (this.acc & 1) ? true : false;
        this.acc = (temp >> 1) | (this.carry_ff ? 0x08 : 0);
    },

    // ---- Carry Flag ----
    CLC: function(imm) {
        debugger;
        this.carry_ff = false;
    },
    STC: function(imm) {
        debugger;
        this.carry_ff = true;
    },
    TC: function(imm) {
        debugger;
        if (this.carry_ff) {
            this.skip();
        }
    },

    // ---- Increment and Decrement ----
    INC: function(imm) {
        debugger;
        this.acc = (this.acc + 1) & 0xF;
        if (!this.acc) {
            this.skip();
        }
    },
    DEC: function(imm) {
        debugger;
        this.acc = (this.acc - 1) & 0xF;
        if (this.acc === 0x0F) {
            this.skip();
        }
    },
    IND: function(imm) {
        debugger;
        this.dp_l = (this.dp_l + 1) & 0xF;
        if (!this.dp_l) {
            this.skip();
        }
    },
    DED: function(imm) {
        debugger;
        this.dp_l = (this.dp_l - 1) & 0xF;
        if (this.dp_l === 0xF) {
            this.skip();
        }
    },
    INM: function(imm) {
        debugger;
        this.ram[this.dp] = (this.ram[this.dp] + 1) & 0xF;
        if (!this.ram[this.dp]) {
            this.skip();
        }
    },
    DEM: function(imm) {
        debugger;
        this.ram[this.dp] = (this.ram[this.dp] - 1) & 0xF;
        if (this.ram[this.dp] === 0xF) {
            this.skip();
        }
    },

    // ---- Bit Manipulation ----
    RMB: function(imm) {
        debugger;
        this.ram[this.dp] &= ~(1 << imm);
    },
    SMB: function(imm) {
        debugger;
        this.ram[this.dp] |= 1 << imm;
    },
    REB: function(imm) {
        debugger;
        this.output(4, this.input(4) & ~(1 << imm));
    },
    SEB: function(imm) {
        debugger;
        this.output(4, this.input(4) | (1 << imm));
    },
    RPB: function(imm) {
        debugger;
        this.output(this.dp_l, this.input(this.dp_l) & ~(1 << imm));
    },
    SPB: function(imm) {
        debugger;
        this.output(this.dp_l, this.input(this.p_l) | (1 << imm));
    },

    // ---- Jump, Call and Return ----
    JMP: function (imm) {
        this.pc = imm;
    },
    CAL: function (imm) {
        this.push();
        this.pc = imm;
    },
    JCP: function (imm) {
        debugger ;
        this.pc = (this.pc & ~0x3F) | (op & 0x3F);
    },
    CZP: function (imm) {
        debugger ;
        this.push();
        this.pc = imm << 2;
    },
    JPA: function(imm) {
        debugger;
        this.pc = (this.pc & ~0x3F) | (this.acc << 2);
    },
    RT: function(imm) {
        debugger;
        this.pop();
    },
    RTS: function(imm) {
        debugger;
        this.skip();
    },

    // ---- Skip ----
    CI: function(imm) {
        debugger;
        if (imm == this.acc) {
            this.skip();
        }
    },
    CM: function(imm) {
        debugger;
        if (this.ram[this.dp] == this.acc) {
            this.skip();
        }
    },
    CMB: function(imm) {
        debugger;
        if ((this.ram[this.dp] ^ ~this.acc) & (1 << imm)) {
            this.skip();
        }
    },
    TAB: function(imm) {
        debugger;
        if (this.acc & (1 << imm)) {
            this.skip();
        }
    },
    CLI: function(imm) {
        debugger;
        if (imm & 0xF == this.dp_l) {
            this.skip();
        }
    },
    TMB: function(imm) {
        debugger;
        if (this.ram[this.dp] & (1 << imm)) {
            this.skip();
        }
    },
    TPA: function(imm) {
        debugger;
        if (this.read(0) & (1 << imm)) {
            this.skip();
        }
    },
    TPB: function(imm) {
        debugger;
        if (this.read(this.dp_l) & (1 << imm)) {
            this.skip();
        }
    },

    // ---- Interrupt ----
    EI: function(imm) {
        debugger;
        this.ie_ff = true;
    },
    DI: function(imm) {
        debugger;
        this.ie_ff = false;
    },
    TIT: function(imm) {
        debugger;
        if (this.int_ff) {
            this.skip();
            this.int_ff = false;
        }
    },

    // ---- Parallel I/O ----
    IA: function(imm) {
        debugger;
        this.acc = this.input(0);
    },
    IP: function(imm) {
        debugger;
        this.acc = this.input(this.dp_l);
    },
    OE: function(imm) {
        debugger;
        this.output(4, this.acc);
    },
    OP: function(imm) {
        debugger;
        this.output(this.dp_l, this.acc);
    },
    OCD: function(imm) {
        debugger;
        this.output(2, imm & 0xF);
        this.output(3, imm >> 4);
    },

    // ---- CPU Control ----
    NOP: function(imm) {},

    // ---- Flag ----
    SFB: function(imm) {
        debugger;
        this.flag |= 1 << imm;
    },
    RFB: function(imm) {
        debugger;
        this.flag &= ~(1 << imm);
    },
    FBT: function(imm) {
        debugger;
        if (this.flag & (1 << imm)) {
            this.skip();
        }
    },
    FBF: function(imm) {
        debugger;
        if (~this.flag & (1 << imm)) {
            this.skip();
        }
    },

    // ---- Timer ----
    STM: function(imm) {
        debugger;
        this.tim_ff = false;
        this.tc = (imm + 1) * 63;
    },

    TTM: function(imm) {
        debugger;
        if (this.tim_ff) {
            this.skip();
        }
    },
};
