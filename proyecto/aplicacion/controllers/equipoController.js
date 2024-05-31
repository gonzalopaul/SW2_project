const Equipo = require('../models/equipo');

exports.createEquipo = async (req, res) => {
  try {
    const { nombre, estadio } = req.body;

    if (!nombre || !estadio) {
      return res.status(400).json({ message: "Nombre y estadio son obligatorios" });
    }

    const nuevoEquipo = new Equipo({
      nombre,
      estadio
    });

    await nuevoEquipo.save();

    res.status(201).json({ message: "Equipo creado exitosamente", equipo: nuevoEquipo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getAllEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.find();
    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEquipoById = async (req, res) => {
    try {
      const { id } = req.params;
      const equipo = await Equipo.findOne({ id: id });
  
      if (!equipo) {
        return res.status(404).json({ message: "Equipo no encontrado" });
      }
  
      res.status(200).json(equipo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
