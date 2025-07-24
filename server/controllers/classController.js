const Trainer = require('../models/Trainer');
const Class = require('../models/Class');

// @desc    Admin create a new class (backend assigns trainers automatically)
// @route   POST /api/admin/classes
// @access  Private (Admin only)
const createClass = async (req, res) => {
    try {
      const {
        className,
        skill,
        image,
        details,
        duration,
        level,
        location,
        equipmentNeeded,
        capacity,
        language,
      } = req.body;
  
      if (!className || !skill || !image || !details) {
        return res.status(400).json({ error: 'Class name, skill, image, and details are required' });
      }
  
      // Find approved trainers who teach this skill
      const matchedTrainers = await Trainer.find({
        status: 'approved',
        skills: { $in: [skill.toLowerCase()] },
      }).limit(5);
  
      const trainerIds = matchedTrainers.map(trainer => trainer._id);
  
      const newClass = new Class({
        className,
        skill: skill.toLowerCase(),
        image,
        details,
        duration: duration || '1 hour',
        level: level || 'Beginner',
        location: location || 'Online',
        equipmentNeeded: equipmentNeeded || [],
        capacity: capacity || 20,
        language: language || 'English',
        trainers: trainerIds,
      });
  
      const savedClass = await newClass.save();
  
      // // Update each matched trainer's classes array with this new class ID
      // await Trainer.updateMany(
      //   { _id: { $in: trainerIds } },
      //   { $addToSet: { classes: savedClass._id } }
      // );
  
      res.status(201).json({
        message: 'Class created successfully with trainers assigned',
        class: savedClass,
      });
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({ error: 'Server error while creating class' });
    }
  };
  
// @desc    Get all classes with search, pagination, trainer limit
// @route   GET /api/admin/classes?search=yoga&page=1&limit=6
// @access  Private (Admin only)
// GET /api/classes?search=cardio&page=1&limit=6
const getAllClasses = async (req, res) => {
  try {
    const {
      search = '',
      page = 1,
      limit,
      sort,
      paginate = 'true'
    } = req.query;

    const query = {
      $or: [
        { className: { $regex: search, $options: 'i' } },
        { skill: { $regex: search, $options: 'i' } }
      ]
    };

    // Sort by bookings (e.g., /api/classes?sort=bookings&limit=4)
    if (sort === 'bookings' && limit) {
      const topBookedClasses = await Class.find(query)
        .sort({ bookingCount: -1 })
        .limit(parseInt(limit))
        .populate('trainers');

      return res.json({ classes: topBookedClasses });
    }

    // If pagination is disabled, return all
    if (paginate === 'false') {
      const classes = await Class.find(query).populate('trainers');
      return res.json({ classes });
    }

    // Default paginated fetch
    const perPage = parseInt(limit) || 10;
    const currentPage = parseInt(page);
    const skip = (currentPage - 1) * perPage;

    const classes = await Class.find(query)
      .skip(skip)
      .limit(perPage)
      .populate('trainers');

    const total = await Class.countDocuments(query);
    const totalPages = Math.ceil(total / perPage);

    return res.json({
      classes,
      total,
      pages: totalPages,
      currentPage
    });

  } catch (error) {
    console.error("Error in getAllClasses:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get a single class by ID
// @route   GET /api/classes/:id
// @access  Public
const getClassById = async (req, res) => {
  try {
    const classId = req.params.id;

    const classItem = await Class.findById(classId).populate('trainers'); // no 'select' means include all fields

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classItem);
  } catch (error) {
    console.error('Error fetching class by ID:', error);
    res.status(500).json({ error: 'Server error while fetching class details' });
  }
};
const deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    const deleted = await Class.findByIdAndDelete(classId);

    if (!deleted) {
      return res.status(404).json({ message: 'Class not found' });
    }

    return res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


  

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  deleteClass
};
