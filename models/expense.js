const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
  id : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  details: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  dateOfExpense : {
    
    type: Sequelize.VIRTUAL,  // Specifies that this is a virtual field
    get() {
      const createdAt = this.getDataValue('createdAt');  // Get the 'createdAt' field value from the instance
      if (createdAt) {
        const currentTime = new Date(createdAt);  // Convert 'createdAt' to a Date object
    
        // Format the return time as a human-readable string (e.g., 'Mar 18 2025 12:50 PM')
        const createdTime = currentTime.toLocaleString('en-IN', {
          weekday: 'short',  // abbreviated day of the week (e.g., "Tue")
          year: 'numeric',   // full year (e.g., "2025")
          month: 'short',    // abbreviated month (e.g., "Mar")
          day: 'numeric',    // day of the month (e.g., "18")
          hour: '2-digit',   // 2-digit hour (e.g., "12")
          minute: '2-digit', // 2-digit minute (e.g., "50")
          second: '2-digit', // 2-digit second (e.g., "57")
          hour12: true       // 12-hour format (e.g., "12:50 PM")
        });

        return createdTime;  // Return the formatted date string
      }
      return null;  // If 'createdAt' is null, return null
    }
  }
},{
  timestamps: true
});

module.exports = Expense;
