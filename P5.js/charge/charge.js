// This is not a scientific utility or library and all the calculations made are
// arbitrary and serve purely visualization purpose.

// Sets the size of a vector. Unit of length measurement is currently dependent on it, which can be changed.
const base_length = 40;
// Distance between vectors in the grid.
const distance_between = base_length * .09;

const unit_pixels = base_length + distance_between

const scale = 10 ** -9;
const unit = (unit_pixels) * scale;

// Constants related to physics
const permittivity = 8.8541878128 * 10 ** -12;
const vacuum_force = 1 / (4 * 3.14159265358 * permittivity);

class ElectricCharge {
    constructor(u_x, u_y, charge) {
        // Position vector of the electric charge relative to a particular unit of length.
        this.u_x = u_x;
        this.u_y = u_y;

        // Position vector representing coordinates of the center of the electric charge in pixels
        this.x = u_x * unit_pixels;
        this.y = u_y * unit_pixels;

        // Initializing initial velocity of each created charge to achieve different behaviour each time reloading the page and introduce variety 
        this.v_x = random(-.002, .002);
        this.v_y = random(-.002, .002);

        // Charge of the particle in Coulombs
        this.charge = charge;

        // The charge is either positive or negative. Not used.
        // this.sign = charge > 0 ? 1 : -1;
    }

    draw() {
        let size = 50;
        push()
        strokeWeight(3)
        if (this.charge > 0) {
            stroke(240, 15, 40)
            fill(240, 15, 40)
            circle(this.x, this.y, size)

            stroke(255)
            line(this.x - size / 2 + (size * .1), this.y, this.x + size / 2 - (size * .1), this.y)
            line(this.x, this.y + size / 2 - (size * .1), this.x, this.y - size / 2 + (size * .1))
            pop()
        }
        else {
            stroke(40, 15, 240)
            fill(40, 15, 240)
            circle(this.x, this.y, size)

            stroke(255)
            line(this.x - size / 2 + (size * .1), this.y, this.x + size / 2 - (size * .1), this.y)
            pop()
        }
        push()
        let trans_x = this.charge > 0 ? -27 : -37;
        translate(trans_x, 43)
        fill(20, 255, 120)
        stroke(140, 120, 170)
        textFont('Courier New', 17);
        text(this.charge + 'C', this.x, this.y)
        pop()
    }

    move() {
        this.u_x += this.v_x;
        this.u_y += this.v_y;

    }
}

class Vector {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.u_x = x / unit_pixels;
        this.u_y = y / unit_pixels;

        this.angle = 0;
        this.magnitude = 1;
        this.base_length = base_length * scale;
    }

    change_angle() {
        let dx = 0;
        let dy = 0;
        for (let i = 0; i < charges.length; ++i) {
            let distance = dist(charges[i].u_x, charges[i].u_y, this.u_x, this.u_y);
            distance *= 10 ** -9;
            dx += (charges[i].u_x - this.u_x) * charges[i].charge / (distance * distance);
            dy += (charges[i].u_y - this.u_y) * charges[i].charge / (distance * distance);
        }
        let magnitude = mag(dx, dy)
        this.draw(map(magnitude, 0, 4.5 * 10 ** 8, 0, 255))
        this.angle = atan2(dy, dx)
    }

    draw(stroke_color) {
        stroke(stroke_color + 5, stroke_color + 10, stroke_color + 15)
        strokeWeight(2)
        fill(stroke_color + 5, stroke_color + 10, stroke_color + 15)

        let line_start = createVector(
            this.x + cos((this.angle)) * (this.base_length / 2),
            this.y + sin((this.angle)) * (this.base_length / 2)
        );

        let line_end = createVector(
            this.x + cos((this.angle + PI)) * (this.base_length / 2),
            this.y + sin((this.angle + PI)) * (this.base_length / 2)
        );

        let tip_start = createVector(
            this.x + cos((this.angle + PI + (30 * PI / 180))) * (this.base_length / 2) * .75,
            this.y + sin((this.angle + PI + (30 * PI / 180))) * (this.base_length / 2) * .75
        );

        let tip_end = createVector(
            this.x + cos((this.angle + PI - (30 * PI / 180))) * (this.base_length / 2) * .75,
            this.y + sin((this.angle + PI - (30 * PI / 180))) * (this.base_length / 2) * .75
        );

        switch (field_slider.value()) {
            // Handling the type of vector representation to draw in the window
            case 0:
                line(line_start.x, line_start.y, line_end.x, line_end.y)
                triangle(tip_start.x, tip_start.y, line_end.x, line_end.y, tip_end.x, tip_end.y)
                break;
            case 1:
                line(line_start.x, line_start.y, line_end.x, line_end.y)
                line(tip_start.x, tip_start.y, line_end.x, line_end.y)
                line(tip_end.x, tip_end.y, line_end.x, line_end.y)
                break;
            case 2:
                line(line_start.x, line_start.y, line_end.x, line_end.y)
                break;
            case 3:
                line(line_start.x, line_start.y, line_end.x, line_end.y)
                circle(line_end.x, line_end.y, 5)
                break;
            case 4:
                line(tip_start.x, tip_start.y, line_end.x, line_end.y)
                line(tip_end.x, tip_end.y, line_end.x, line_end.y)
                break;
        }

    }
}

let vectors = [];
let charges = [];

let field_slider;

function setup() {
    createCanvas(this.innerWidth, this.innerHeight)
    field_slider = createSlider(0, 4, 0)

    w_count = int(this.innerWidth / (base_length + distance_between)) + 1
    h_count = int(this.innerHeight / (base_length + distance_between)) + 1

    for (let i = 0; i < w_count; ++i) {
        for (let j = 0; j < h_count; ++j) {
            let x = i * (base_length + distance_between) + base_length / 2
            let y = j * (base_length + distance_between) + base_length / 2

            new_vector = new Vector(x, y, 1)
            vectors.push(new_vector);
        }
    }
    // Charges initialization
    charge1 = new ElectricCharge(width / (2 * unit_pixels) - 3, height / (2 * unit_pixels) + 2, .7 * 10 ** -9);
    charge2 = new ElectricCharge(width / (2 * unit_pixels), height / (2 * unit_pixels), .7 * -(10 ** -9));
    charge3 = new ElectricCharge(width / (2 * unit_pixels) + 6, height / (2 * unit_pixels), 1 * (1e-9));

    charges.push(charge1);
    charges.push(charge2);
    charges.push(charge3);
}

function draw() {
    background(5, 10, 15)

    for (let i = 0; i < charges.length; ++i) {
        for (let j = i + 1; j < charges.length; ++j) {

            time_unit = 5e-11 // Affects the speed of the simulation
            let dx = charges[j].u_x - charges[i].u_x;
            let dy = charges[j].u_y - charges[i].u_y;
            let vector = createVector(dx, dy)
            vector.normalize()

            distance = dist(charges[i].x, charges[j].x, charges[i].y, charges[j].y) * 10 ** -9;
            distance = constrain(distance, 1e-7, 5) * 1e-1
            let force = -time_unit * vacuum_force * charges[i].charge * charges[j].charge / (distance * distance)

            charges[i].v_x += force * vector.x;
            charges[i].v_y += force * vector.y;
            charges[j].v_x -= force * vector.x;
            charges[j].v_y -= force * vector.y;
        }
    }

    push()
    for (vector of vectors) {
        vector.change_angle();
    }
    pop()

    // Updating position of each charge and displaying electric charges on the screen
    for (charge of charges) {
        charge.x = charge.u_x * unit_pixels
        charge.y = charge.u_y * unit_pixels

        charge.move();
        charge.draw();
    }

    push()
    fill(255)
    text("1nm", width / 2, height - 25)

    stroke(255, 0, 0)
    strokeWeight(2)
    unit_middle = createVector(width / 2 + 13, height - 15)

    line(unit_middle.x - (unit_pixels / 2), unit_middle.y, unit_middle.x + (unit_pixels / 2), unit_middle.y)
    pop()
}
