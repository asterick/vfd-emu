var fs = require("fs");

module.exports = {
    EPOCH_DRACULA: fs.readFileSync(__dirname + '/../roms/D553C-206 Epoch Dracula.bin'),
    TOMY_ALIEN_CHASE: fs.readFileSync(__dirname + '/../roms/D553C-258 Tomy Alien Chase.bin')
};
