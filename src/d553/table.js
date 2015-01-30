var ops = require("./ops");

var table = {
    0x00: { opcode: "NOP", immediate:  0, bytes: 1, clocks: 1 },
    0x01: { opcode: "DI",  immediate:  0, bytes: 1, clocks: 1 },
    0x02: { opcode: "S",   immediate:  0, bytes: 1, clocks: 1 },
    0x03: { opcode: "TIT", immediate:  0, bytes: 1, clocks: 1 },
    0x04: { opcode: "TC",  immediate:  0, bytes: 1, clocks: 1 },
    0x05: { opcode: "TTM", immediate:  0, bytes: 1, clocks: 1 },
    0x06: { opcode: "DAA", immediate:  0, bytes: 1, clocks: 1 },
    0x07: { opcode: "TAL", immediate:  0, bytes: 1, clocks: 1 },
    0x08: { opcode: "AD",  immediate:  0, bytes: 1, clocks: 1 },
    0x09: { opcode: "ADS", immediate:  0, bytes: 1, clocks: 1 },
    0x0A: { opcode: "DAS", immediate:  0, bytes: 1, clocks: 1 },
    0x0B: { opcode: "CLC", immediate:  0, bytes: 1, clocks: 1 },
    0x0C: { opcode: "CM",  immediate:  0, bytes: 1, clocks: 1 },
    0x0D: { opcode: "INC", immediate:  0, bytes: 1, clocks: 1 },
    0x0E: { opcode: "OP",  immediate:  0, bytes: 1, clocks: 1 },
    0x0F: { opcode: "DEC", immediate:  0, bytes: 1, clocks: 1 },
    0x10: { opcode: "CMA", immediate:  0, bytes: 1, clocks: 1 },
    0x11: { opcode: "CIA", immediate:  0, bytes: 1, clocks: 1 },
    0x12: { opcode: "TLA", immediate:  0, bytes: 1, clocks: 1 },
    0x13: { opcode: "DED", immediate:  0, bytes: 1, clocks: 1 },
    0x14: { opcode: "STM", immediate:  6, bytes: 2, clocks: 2 },
    0x15: { opcode: "LDI", immediate:  7, bytes: 2, clocks: 2 },
    0x16: { opcode: "CLI", immediate:  4, bytes: 2, clocks: 2 },
    0x17: { opcode: "CI",  immediate:  4, bytes: 2, clocks: 2 },
    0x18: { opcode: "EXL", immediate:  0, bytes: 1, clocks: 1 },
    0x19: { opcode: "ADC", immediate:  0, bytes: 1, clocks: 1 },
    0x1A: { opcode: "XC",  immediate:  0, bytes: 1, clocks: 1 },
    0x1B: { opcode: "STC", immediate:  0, bytes: 1, clocks: 1 },
    0x1D: { opcode: "INM", immediate:  0, bytes: 1, clocks: 1 },
    0x1E: { opcode: "OCD", immediate:  8, bytes: 2, clocks: 2 },
    0x1F: { opcode: "DEM", immediate:  0, bytes: 1, clocks: 1 },
    0x20: { opcode: "FBF", immediate:  2, bytes: 1, clocks: 2 },
    0x24: { opcode: "TAB", immediate:  2, bytes: 1, clocks: 1 },
    0x28: { opcode: "XM",  immediate:  2, bytes: 1, clocks: 1 },
    0x2C: { opcode: "XMD", immediate:  2, bytes: 1, clocks: 1 },
    0x30: { opcode: "RAR", immediate:  0, bytes: 1, clocks: 1 },
    0x31: { opcode: "EI",  immediate:  0, bytes: 1, clocks: 1 },
    0x32: { opcode: "IP",  immediate:  0, bytes: 1, clocks: 1 },
    0x33: { opcode: "IND", immediate:  0, bytes: 1, clocks: 1 },
    0x34: { opcode: "CMB", immediate:  2, bytes: 1, clocks: 1 },
    0x38: { opcode: "LM",  immediate:  2, bytes: 1, clocks: 1 },
    0x3C: { opcode: "XMI", immediate:  2, bytes: 1, clocks: 1 },
    0x40: { opcode: "IA",  immediate:  0, bytes: 1, clocks: 1 },
    0x41: { opcode: "JPA", immediate:  0, bytes: 1, clocks: 2 },
    0x42: { opcode: "TAZ", immediate:  0, bytes: 1, clocks: 2 },
    0x43: { opcode: "TAW", immediate:  0, bytes: 1, clocks: 2 },
    0x44: { opcode: "OE",  immediate:  0, bytes: 1, clocks: 1 },
    0x46: { opcode: "TLY", immediate:  0, bytes: 1, clocks: 2 },
    0x47: { opcode: "THX", immediate:  0, bytes: 1, clocks: 2 },
    0x48: { opcode: "RT",  immediate:  0, bytes: 1, clocks: 2 },
    0x49: { opcode: "RTS", immediate:  0, bytes: 1, clocks: 1 },
    0x4A: { opcode: "XAZ", immediate:  0, bytes: 1, clocks: 2 },
    0x4B: { opcode: "XAW", immediate:  0, bytes: 1, clocks: 2 },
    0x4C: { opcode: "XLS", immediate:  0, bytes: 1, clocks: 2 },
    0x4D: { opcode: "XHR", immediate:  0, bytes: 1, clocks: 2 },
    0x4E: { opcode: "XLY", immediate:  0, bytes: 1, clocks: 2 },
    0x4F: { opcode: "XHX", immediate:  0, bytes: 1, clocks: 2 },
    0x50: { opcode: "TPB", immediate:  2, bytes: 1, clocks: 1 },
    0x54: { opcode: "TPA", immediate:  2, bytes: 1, clocks: 1 },
    0x58: { opcode: "TMB", immediate:  2, bytes: 1, clocks: 1 },
    0x5C: { opcode: "FBT", immediate:  2, bytes: 1, clocks: 2 },
    0x60: { opcode: "RPB", immediate:  2, bytes: 1, clocks: 1 },
    0x64: { opcode: "REB", immediate:  2, bytes: 1, clocks: 2 },
    0x68: { opcode: "RMB", immediate:  2, bytes: 1, clocks: 1 },
    0x6C: { opcode: "RFB", immediate:  2, bytes: 1, clocks: 2 },
    0x70: { opcode: "SPB", immediate:  2, bytes: 1, clocks: 1 },
    0x74: { opcode: "SEB", immediate:  2, bytes: 1, clocks: 2 },
    0x78: { opcode: "SMB", immediate:  2, bytes: 1, clocks: 1 },
    0x7C: { opcode: "SFB", immediate:  2, bytes: 1, clocks: 2 },
    0x80: { opcode: "LDZ", immediate:  4, bytes: 1, clocks: 1 },
    0x90: { opcode: "LI",  immediate:  4, bytes: 1, clocks: 1 },
    0xA0: { opcode: "JMP", immediate: 11, bytes: 2, clocks: 2 },
    0xA8: { opcode: "CAL", immediate: 11, bytes: 2, clocks: 2 },
    0xB0: { opcode: "CZP", immediate:  4, bytes: 1, clocks: 1 },
    0xC0: { opcode: "JCP", immediate:  6, bytes: 1, clocks: 1 },
};

// Fill in the gaps in the table
Object.keys(table).forEach(function (index) {
    var entry = table[index],
        masked = entry.immediate - (entry.bytes - 1) * 8;

    entry.execute = ops[entry.opcode];

    if (masked > 0) {
        for (var i = (1 << masked) - 1; i > 0; i--) {
            table[i+Number(index)] = entry;
        }
    }
});

module.exports = table;
