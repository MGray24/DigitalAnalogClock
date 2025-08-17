// each minute hands angle for each digit
const minuteAngleMap = {
    0: { '0': 90, '1': 215, '2': 90, '3': 90, '4': 180, '5': 90, '6': 90, '7': 90, '8': 90, '9': 90 },
    1: { '0': 180, '1': 180, '2': 180, '3': 180, '4': 180, '5': 270, '6': 270, '7': 180, '8': 180, '9': 180 },
    2: { '0': 0, '1': 215, '2': 90, '3': 90, '4': 0, '5': 0, '6': 0, '7': 215, '8': 90, '9': 0 },
    3: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 180, '6': 180, '7': 0, '8': 180, '9': 0 },
    4: { '0': 0, '1': 215, '2': 0, '3': 90, '4': 215, '5': 90, '6': 0, '7': 215, '8': 0, '9': 90 },
    5: { '0': 0, '1': 0, '2': 270, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 }
};

// each hour hands angle for each digit
const hourAngleMap = {
    0: { '0': 180, '1': 215, '2': 90, '3': 90, '4': 180, '5': 180, '6': 180, '7': 90, '8': 180, '9': 180 },
    1: { '0': 270, '1': 180, '2': 270, '3': 270, '4': 180, '5': 270, '6': 270, '7': 270, '8': 270, '9': 270 },
    2: { '0': 180, '1': 215, '2': 180, '3': 90, '4': 90, '5': 90, '6': 180, '7': 215, '8': 180, '9': 90 },
    3: { '0': 180, '1': 180, '2': 270, '3': 270, '4': 180, '5': 270, '6': 270, '7': 180, '8': 270, '9': 180 },
    4: { '0': 90, '1': 215, '2': 90, '3': 90, '4': 215, '5': 90, '6': 90, '7': 215, '8': 90, '9': 90 },
    5: { '0': 270, '1': 0, '2': 270, '3': 270, '4': 0, '5': 270, '6': 270, '7': 0, '8': 270, '9': 270 }
};

const digitalClock = document.querySelector('.digital_clock');

for (let i = 0; i < 4; i++) { // 4 digital_number rows
    const digitalNumber = document.createElement('div');
    digitalNumber.className = 'digital_number';
    digitalNumber.id = `digital_number_${i}`
    for (let j = 0; j < 6; j++) { // 6 analog_clock per row
        const analogClock = document.createElement('div');
        analogClock.className = 'analog_clock';
        analogClock.id = `dig_${i}_analog_clock_${j}`

        const analogCenter = document.createElement('div');
        analogCenter.className = 'analog_center';

        const handHour = document.createElement('div');
        handHour.className = 'hand hour';

        const handMinute = document.createElement('div');
        handMinute.className = 'hand minute';

        analogClock.appendChild(analogCenter);
        analogClock.appendChild(handHour);
        analogClock.appendChild(handMinute);

        digitalNumber.appendChild(analogClock);
    }
    digitalClock.appendChild(digitalNumber);
}

const handStates = [];

const clocks = document.querySelectorAll('.analog_clock');
clocks.forEach(clock => {
    const hourHand = clock.querySelector('.hand.hour');
    const minuteHand = clock.querySelector('.hand.minute');

    handStates.push({
        element: hourHand,
        prevAngle: 0,
        nextAngle: 0
    });
    handStates.push({
        element: minuteHand,
        prevAngle: 0,
        nextAngle: 0
    });
});

//SETS INITIAL POSITIONS ON PAGE LOAD
const now = new Date();
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const timeDigits = hours + minutes;

const nextMinuteDate = new Date(now.getTime() + 60000);
const nextHours = nextMinuteDate.getHours().toString().padStart(2, '0');
const nextMinutes = nextMinuteDate.getMinutes().toString().padStart(2, '0');
const nextTimeDigits = nextHours + nextMinutes;

handStates.forEach(hand => {
    hand.prevAngle = getNextAngle(hand, timeDigits);
    hand.nextAngle = getNextAngle(hand, nextTimeDigits);
});

function getNextAngle(hand, timeDigits) {
    const parentId = hand.element.parentElement.id;
    const digitidx = parseInt(parentId.charAt(4));
    const clockidx = parseInt(parentId.charAt(parentId.length - 1));
    const digittomake = timeDigits[digitidx]
    if (hand.element.classList.contains('minute')) {
        return minuteAngleMap[clockidx][digittomake];
    } else if (hand.element.classList.contains('hour')) {
        return hourAngleMap[clockidx][digittomake];
    }

    return 0;
}

function updateHandsAndTime() {
    const now = new Date();

    if (now.getMinutes() !== currentMinute) {
        currentMinute = now.getMinutes();
        // When the minute changes, set prevAngle to nextAngle and update nextAngle as needed
        handStates.forEach(hand => {
            hand.prevAngle = hand.nextAngle;
    
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeDigits = hours + minutes; // e.g. "1235"

            const nextMinuteDate = new Date(now.getTime() + 60000); // add 1 minute
            const nextHours = nextMinuteDate.getHours().toString().padStart(2, '0');
            const nextMinutes = nextMinuteDate.getMinutes().toString().padStart(2, '0');
            const nextTimeDigits = nextHours + nextMinutes;
            hand.nextAngle = getNextAngle(hand, nextTimeDigits);
        });
    }

    // Calculate the current angle for each hand based on msPast
    handStates.forEach(hand => {
        let prev = hand.prevAngle;
        let next = hand.nextAngle;
        // Ensure clockwise movement
        if (next < prev || next == prev) {
            next += 360;
        }
        const msPast = now.getSeconds() * 1000 + now.getMilliseconds();
        const fraction = msPast / 60000; // 60,000 ms in a minute
        const angle = prev + (next - prev) * fraction;
        hand.element.style.transform = `rotate(${angle}deg)`;
    });
}


let currentMinute = new Date().getMinutes();

setInterval(updateHandsAndTime, 1);

const toggleButton = document.getElementById("theme-toggle");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Update button text/icon
  if (document.body.classList.contains("dark-mode")) {
    toggleButton.textContent = "☀️ Light Mode";
  } else {
    toggleButton.textContent = "🌙 Dark Mode";
  }
});