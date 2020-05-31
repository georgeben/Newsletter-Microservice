class SubscriberRepository {
  constructor({ Subscriber }) {
    this.Subscriber = Subscriber;
  }

  async createSubscriber({ name, email }) {
    let subscriber = new this.Subscriber({
      name,
      email,
    });
    subscriber = await subscriber.save();
    return subscriber;
  }

  async getAllSubscribers() {
    return this.Subscriber.find();
  }

  async findSubscriberByEmail(email) {
    return this.Subscriber.findOne({ email });
  }

  async deleteSubscriber(email) {
    return this.Subscriber.deleteOne({ email });
  }
}

module.exports = SubscriberRepository;
