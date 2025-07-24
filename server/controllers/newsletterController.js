const Subscriber = require('../models/NewsletterSubscriber');

// @desc Subscribe user to newsletter
// @route POST /api/newsletter/subscribe
// @access Public
const subscribeUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'You are already subscribed.' });
    }

    const subscriber = new Subscriber({ name, email });
    await subscriber.save();

    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
};
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.status(200).json(subscribers);
  } catch (err) {
    console.error('Fetching subscribers failed:', err);
    res.status(500).json({ message: 'Failed to fetch subscribers.' });
  }
};
const deleteSubscriber = async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subscriber deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed.' });
  }
};

module.exports = { subscribeUser ,getAllSubscribers,deleteSubscriber};
