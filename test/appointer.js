const assert = require("chai").assert;
const appointer = require("../appointer");

const { Employee, Appointment } = appointer;

describe("Utilities", () => {
  describe("Hour to Number", () => {
    const { hourToNumber } = appointer;

    const inputs = [
      "00:00", // 0
      "09:09", // Leading zeros
      "10:10", // Trailing zeros
      "23:59" // "Arbitrary" number
    ];

    const expected = [0, 909, 1010, 2359];

    const badInputs = [
      "24:00", // Should be null
      "40:98", // Insane hour
      "19923:998283" // Insane(r) hour
    ];

    it("should convert times between '00:00' and '23:59'", () => {
      for (let i = 0; i < inputs.length; i++) {
        assert.equal(hourToNumber(inputs[i]), expected[i]);
      }
    });

    it("should throw exceptions for times outside sane ranges", () => {
      for (let i = 0; i < badInputs.length; i++) {
        assert.throw(() => hourToNumber(badInputs[i]));
      }
    });
  });

  describe("Number to Hour", () => {
    const { numberToHour } = appointer;

    const inputs = [0, 909, 1010, 2359];

    const expected = [
      "00:00", // 0
      "09:09", // Leading zeros
      "10:10", // Trailing zeros
      "23:59" // "Arbitrary" number
    ];

    const badInputs = [2400, 4098, 19923998283];

    it("should convert times between 0 and 2359", () => {
      for (let i = 0; i < inputs.length; i++) {
        assert.equal(numberToHour(inputs[i]), expected[i]);
      }
    });

    it("should throw exceptions for times outside sane ranges", () => {
      for (let i = 0; i < badInputs.length; i++) {
        assert.throw(() => numberToHour(badInputs[i]));
      }
    });
  });

  describe("Format date", () => {
    const { formatDate } = appointer;

    const inputs = [
      new Date(2020, 0, 1, 0, 0, 0, 0),
      new Date(2020, 0, 31, 23, 59, 59, 999)
    ];

    const expected = ["2020-01-01", "2020-01-31"];

    it("should contain exactly 10 characters", () => {
      inputs.map(e => assert.lengthOf(formatDate(e), 10));
    });

    it("should not be affected by timezone offset", () => {
      for (let i = 0; i < inputs.length; i++) {
        assert.equal(formatDate(inputs[i]), expected[i]);
      }
    });
  });
});

describe("Classes", () => {
  describe("Employee", () => {
    it("should alert about incomplete workdays on Employee", () => {
      assert.throw(() => new Employee("1", [{}, {}, {}]));
    });
  });
  describe("Appointment", () => {});
});

describe("Appointer", () => {
  describe("Weekly Disponibility", () => {
    const { getWeeklyDisponibility } = appointer;

    it("should have no available appointments when there are no employees", () => {
      getWeeklyDisponibility([]).map(e => assert.isEmpty(e));
    });

    it("should have no available appointments when employees have empty schedules", () => {
      const employee = new Employee("Employee 1", [{}, {}, {}, {}, {}, {}, {}]);
      getWeeklyDisponibility([employee]).map(e => assert.isEmpty(e));
    });

    it("should sum the availability of all the employees", () => {
      const employees = [
        new Employee("1", [
          { start: "10:00", end: "11:00" },
          {},
          { start: "10:00", end: "11:00" },
          {},
          {},
          {},
          {}
        ]),
        new Employee("2", [
          { start: "15:00", end: "16:00" },
          { start: "15:00", end: "16:00" },
          { start: "10:00", end: "11:00" },
          {},
          {},
          {},
          {}
        ])
      ];

      const disponibility = getWeeklyDisponibility(employees);

      assert.hasAllKeys(
        disponibility[0],
        ["10:00", "10:30", "15:00", "15:30"],
        "on a single day"
      );

      assert.isNotEmpty(disponibility[1], "for different days");

      assert.equal(disponibility[2]["10:00"], 2, "on same time, same day");
    });

    it("should throw workdays that start after they finish", () => {
      const employee = new Employee("1", [
        { start: "20:00", end: "06:00" },
        {},
        {},
        {},
        {},
        {},
        {}
      ]);
      assert.throw(() => getWeeklyDisponibility([employee]));
    });
  });

  describe("Available Appointments", () => {
    const { getAvailableAppointments } = appointer;
    const today = new Date(2020, 1, 1);

    it("should be empty if all times are already used", () => {
      const appointmentDate = "2020-03-02";
      const appointmentTime = "06:00";

      const employees = [
        new Employee("1", [
          {},
          { start: "6:00", end: "6:30" },
          {},
          {},
          {},
          {},
          {}
        ])
      ];

      const appointments = [
        new Appointment("1", appointmentDate, appointmentTime)
      ];

      const availableAppointments = getAvailableAppointments(
        employees,
        appointments,
        today
      );

      assert.isEmpty(availableAppointments[appointmentDate]);
    });

    it("should throw meetings on non-available times", () => {
      const appointments = [new Appointment("1", "2020-03-02", "06:00")];

      assert.throw(() => {
        getAvailableAppointments([], appointments, today);
      });
    });

    it("should show calendar of January when current month is December", () => {
      // Create a date on December 2020
      const today = new Date(2020, 11, 1);
      const calendar = getAvailableAppointments([], [], today);
      // Expect calendar to be on January 2021
      assert.hasAnyKeys(calendar, "2021-01-01");
    });
  });
});
