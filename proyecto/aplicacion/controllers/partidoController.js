const Partido = require('../models/partido');

exports.getAllPartidos = async (req, res) => {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
        query.fecha = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    try {
        const partidos = await Partido.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Partido.countDocuments(query);

        res.json({
            partidos,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching partidos' });
    }
};

exports.getPartidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const partido = await Partido.findOne({ id: Number(id) });

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.status(200).json(partido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createPartido = async (req, res) => {
  try {
    const { equipoLocal, equipoVisitante, fecha, fullTimeHomeGoals, fullTimeAwayGoals, halfTimeHomeGoals, halfTimeAwayGoals, fullTimeResult, halfTimeResult } = req.body;

    const lastPartido = await Partido.findOne().sort({ id: -1 });
    const newId = lastPartido ? lastPartido.id + 1 : 1;

    const newPartido = new Partido({
      id: newId,
      equipoLocal,
      equipoVisitante,
      fecha,
      fullTimeHomeGoals,
      fullTimeAwayGoals,
      halfTimeHomeGoals,
      halfTimeAwayGoals,
      fullTimeResult,
      halfTimeResult
    });

    await newPartido.save();
    res.status(201).json({ message: 'Partido programado exitosamente', partido: newPartido });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getResultadoByPartidoId = async (req, res) => {
  try {
    const { id } = req.params;
    const partido = await Partido.findOne({ id: Number(id) }, 'fullTimeHomeGoals fullTimeAwayGoals halfTimeHomeGoals halfTimeAwayGoals fullTimeResult halfTimeResult');

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.status(200).json(partido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateResultadoByPartidoId = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullTimeHomeGoals, fullTimeAwayGoals, halfTimeHomeGoals, halfTimeAwayGoals, fullTimeResult, halfTimeResult } = req.body;

    const partido = await Partido.findOne({ id: Number(id) });

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    partido.fullTimeHomeGoals = fullTimeHomeGoals;
    partido.fullTimeAwayGoals = fullTimeAwayGoals;
    partido.halfTimeHomeGoals = halfTimeHomeGoals;
    partido.halfTimeAwayGoals = halfTimeAwayGoals;
    partido.fullTimeResult = fullTimeResult;
    partido.halfTimeResult = halfTimeResult;

    await partido.save();
    res.status(200).json({ message: 'Resultado actualizado exitosamente', partido });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
