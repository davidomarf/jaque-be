class Employee {
  constructor(name, schedule) {
    if (schedule.length != 7)
      throw `The weekly schedule has ${schedule.length} elements`;
    this.name = name;
    this.schedule = schedule;
  }
}

class Appointment {
  constructor(employee, date, time) {
    this.employee = employee;
    this.date = date;
    this.time = time;
  }
}

/**
 * Remove the colon from an hour string and convert to military number
 *
 * Must be in "hh:mm" to work
 *
 * @param {string} hour Hour in format "hh:mm"
 * @return {number} Number from joining hhmm
 */
function hourToNumber(hour) {
  let n = Number(hour.replace(":", ""));
  if (n < 0 || n > 2359) throw "Hour is outside range";
  return n;
}

/**
 * It takes a military time number and converts it to "HH:MM".
 *
 * This will automatically add leading zeros when needed, but sanity
 * is assumed (the number is between 0 and 2359 inclusive, so the resulting hours
 * are between 0 and 23 inclusive, and minutes between 0 and 59 inclusive).
 *
 * @param {number} n Time in military (ideally between 0 and 2359)
 * @return {string} Time in "HH:MM" format
 */
function numberToHour(n) {
  if (n < 0 || n > 2359) throw "Hour is outside range";
  let h = Math.floor(n / 100);
  let m = n % 100;
  return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
}

/**
 * Obtain an array of available times for each day in a whole week
 *
 * The indices of the array correspond to the days of the week:
 *    - 0: Sunday, up to 6: Saturday
 *
 * The content of each day is an object containing, as keys, all the
 * available times for an appointment, and as values, the number of available
 * employees in that time.
 *
 * The keys (the available times) are separated by half an hour, the time of an
 * appointment.
 * @param {Employee[]} employees Array of employees
 * @return {Object} Contains the available times for an appointment in a week
 */
function getWeeklyDisponibility(employees) {
  // Create an array that will contain all the available times to schedule
  // a meeting.
  // Each index in the array corresponds to the weekday from 0 to 6 starting on Sunday.
  let availableTimes = [];

  // For the full week (0 - 6):
  for (let i = 0; i < 7; i++) {
    // Create an empty object with no available times
    availableTimes.push({});

    // Check for all the employees
    for (let j = 0; j < employees.length; j++) {
      // Obtain the working hours of current employee
      let workday = employees[j].schedule[i];

      // If workhours doesn't have a start prop, employee doesn't work
      // on current day, so there are no available times with them.
      if (workday.start === undefined) continue;

      // Convert the start and end times into integers that follow the military format:
      //   - 900 for 09:00
      //   - 1530 for 15:30
      let start = hourToNumber(workday.start);
      let end = hourToNumber(workday.end);

      if (start >= end)
        throw `The employee ${employees[j].name} schedule has the start hour posterior to the end hour`;

      // And start a loop from the start of the workday to finish.
      //
      // The flag value change for each iteration depends on its value:
      //   - If it's o'clock (hour % 100 === 0), it'll increment 30
      //   - If it's half an hour (hour % 1000 === 30) it'll increment 70
      // This will make sure it creates an available time every half an hour.
      for (let time = start; time < end; ) {
        // The hour must be converted back to a string in "HH:MM" format to use
        // as key
        let hour = numberToHour(time);

        // If the current time doesn't exist in the dictionary, create a new key-value pair
        // using the current time.
        if (availableTimes[i][hour] === undefined) {
          availableTimes[i][hour] = 1;
        } else {
          // If it exists, increase the number of available appointments.
          availableTimes[i][hour]++;
        }

        // Handle the increments
        // x:00 -> x:30
        // x:30 -> x+1:00
        if (time % 100 == 0) {
          time += 30;
        } else {
          time += 70;
        }
      }
    }
  }

  return availableTimes;
}

/**
 * Convert a date into the format "YYYY-MM-DD"
 *
 * @param {Date} date
 * @return {string} Date in format "YYYY-MM-DD"
 */
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Convert a calendar with available appointments into requested output
 *
 * Yeah, pretty ambiguous description, but I'd remove this function altogether.
 *
 * @param {Object} calendar Keys are days and values are objects with hours as keys
 */
function filterCalendar(calendar) {
  let available = {};

  for (let day in calendar) {
    available[day] = [];
    for (let hour in calendar[day]) {
      if (calendar[day][hour] > 0) {
        available[day].push(hour);
      }
    }
  }

  return available;
}

/**
 * Obtain all the available date and times in the next month
 *
 * The function assumes that all the appointments are possible, meaning:
 *   - No appointment outside working hours
 *   - No more appointments in a single time that there are working employees
 * @param {Employee[]} employees
 * @param {Appointment[]} appointments
 * @return {Object} Every key is a day, and every value is an array of available times
 */
function getAvailableAppointments(employees, appointments, today = new Date()) {
  let date = new Date(today.getFullYear(), today.getMonth() + 1);
  let nextMonth = date.getMonth();

  // Obtain a default weekly disponibility (assuming no appointments set)
  let weeklyDisponibility = getWeeklyDisponibility(employees, date);

  let calendar = {};

  // This will obtain all the possible meetings for the next month,
  // without considering the already set appointments.
  //
  // Each day (e.g. calendar["2020-03-14"]) will have a map with all the
  // possible hours to make an appointment (e.g. calendar["2020-03-14"]["12:30"])
  // indicating the number of appointments available (one for every employee that
  // works at such hour).
  while (date.getMonth() === nextMonth) {
    // Obtain the day of the week (0-6)
    let weekday = date.getDay();

    // For the calendar, in a specific date, assign a default disponibility
    // based on the day of the week.
    // Spread the object to avoid unexpected mutability
    calendar[formatDate(date)] = { ...weeklyDisponibility[weekday] };

    // Increase the date by one day
    date.setDate(date.getDate() + 1);
  }
  // This will remove all the existing appointments from the month availability
  for (let i = 0; i < appointments.length; i++) {
    // n is the number of available employees to attend meetings
    // on a particular time [day][hour]
    let n = calendar[appointments[i].date][appointments[i].time]--;
    if (n < 0 || isNaN(n)) {
      throw "You made an appointment in a non-available time";
    }
  }

  return filterCalendar(calendar);
}

module.exports = {
  Employee,
  Appointment,
  getAvailableAppointments,
  hourToNumber,
  numberToHour,
  getWeeklyDisponibility,
  formatDate
};
