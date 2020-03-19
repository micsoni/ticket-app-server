const User = require("../user/model");
const Ticket = require("./model");
const Event = require("../event/model");
const Comment = require("../comment/model");

async function getUserTickets(userId) {
  try {
    const user = await User.findByPk(userId, {
      include: [Ticket]
    });
    return user.tickets;
  } catch (error) {
    next(error);
  }
}

async function getEventTickets(eventId) {
  try {
    const event = await Event.findByPk(eventId, {
      include: [Ticket]
    });
    return event.tickets;
  } catch (error) {
    next(error);
  }
}

async function getTicketComments(ticketId) {
  try {
    const comments = await Comment.findAll({ where: { ticketId: ticketId } });
    return comments;
  } catch (error) {
    next(error);
  }
}

async function getTicketRisk(ticket) {
  let risk = 0;

  //check if the ticket is the only ticket of the author, add 10%
  const userTickets = await getUserTickets(ticket.userId);
  if (userTickets.length === 1) {
    risk = risk + 10;
  }

  //check the difference of price between this ticket and the average
  const eventTickets = await getEventTickets(ticket.eventId);

  const averagePrice = eventTickets
    .map(ticket => ticket.price)
    .reduce((acc, ticket) => acc + ticket / eventTickets.length, 0);

  const currentTicketPrice = ticket.price;
  const riskToConsider = averagePrice - currentTicketPrice;

  //if a ticket is X% cheaper than the average price, add X% to the risk
  if (riskToConsider > 0) {
    risk = risk + riskToConsider;
  }
  //if a ticket is X% more expensive than the average price, deduct X% from the risk
  //with a maximum of 10% deduction
  if (riskToConsider < 0) {
    if (riskToConsider < -10) {
      risk = risk - 10;
    } else {
      risk = risk + riskToConsider;
    }
  }

  //if the ticket was added during business hours (9-17)
  // deduct 10% from the risk, if not, add 10% to the risk
  const date = new Date(ticket.createdAt);
  const hourOfTheDay = date.getHours();
  if (hourOfTheDay > 8 && hourOfTheDay < 18) {
    risk = risk - 10;
  } else {
    risk = risk + 10;
  }

  //if there are > 3 comments on the ticket, add 5% to the risk
  const ticketComments = await getTicketComments(ticket.id);

  if (ticketComments.length > 3) {
    risk = risk + 5;
  }

  //The minimal risk is 5%
  if (risk < 5) {
    risk = 5;
  }

  // the maximum risk is 95%
  if (risk > 95) {
    risk = 95;
  }
  return Math.round(risk);
}

module.exports = getTicketRisk;
