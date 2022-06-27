const NavbarInfo = require("../models/navbarInfo");

// Add Navbar data to db
exports.addNavbarData = async (req, res) => {
    if (!req.body?.icon || !req.body?.label) {
      return res.status(400).json({
        error: "Icon and Label are required",
      });
    }
  
    const navbarInfo = new NavbarInfo(req.body);
  
    try {
      const result = await navbarInfo.save();
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  };
  
  // Get Navbar data from db
  exports.getNavbarData = async (req, res) => {
    const navbarInfo = await NavbarInfo.find();
  
    if (!navbarInfo)
      return res.status(204).json({
        error: "No navbarInfo found",
      });
    res.json(navbarInfo);
  };