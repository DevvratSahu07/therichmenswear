const Address = require('../models/Address');

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { UserId: req.user.id } });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { UserId: req.user.id } });
    }
    const address = await Address.create({
      fullName, phone, addressLine1, addressLine2,
      city, state, pincode, isDefault,
      UserId: req.user.id,
    });
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await Address.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAddresses, addAddress, deleteAddress };