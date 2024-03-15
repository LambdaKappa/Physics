class Circle { // Class representing celestial body.
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.v_x = 0;
        this.v_y = 0;
        this.diameter = radius * 2;
        this.mass = 4 * .33 * 3.14159 * radius * radius * radius; // Mass is based on sphere's volume
    }

    move() {
        this.x += this.v_x;
        this.y += this.v_y;
    }
}

// Amount of objects created
let objects_count = 70

// How objects are spread out initially
let initial_distance_ratio = 2

// Gravitational constant
let G = .00005;

// Speed of moving using mouse cursor
let speed = 10;

// Array storing all the celestial bodies objects
let circles = []

// Canvases
let overlay;
let main;

function setup() {
    view = createVector(0, 0)
    main = createCanvas(window.innerWidth, window.innerHeight)
    overlay = createGraphics(window.innerWidth * 2, window.innerHeight * 2)

    background(0)

    for (let i = 0; i < objects_count; ++i) {
        new_circle = new Circle(
            // Setting x coordinate of a body
            initial_distance_ratio * (random(-width / 2, width / 2)) + width / 2,
            // Setting y coordinate of a body
            initial_distance_ratio * (random(-height / 2, height / 2)) + height / 2,
            // Setting radius of a body
            random(3, 10))
        circles.push(new_circle)
    }
}

function draw() {
    translate(view.x - width / 2, view.y - height / 2)
    let pixels_constraint = 10
    if (mouseX < width - pixels_constraint && mouseX > pixels_constraint && mouseY < height - pixels_constraint && mouseY > pixels_constraint) {
        view.x -= map(mouseX, 0, width, -1, 1) * speed
        view.y -= map(mouseY, 0, height, -1, 1) * speed
    }

    background(0)
    fill(0)
    stroke(255)

    image(main, 0, 0)
    image(overlay, 0, 0)

    overlay.stroke(255, 0, 120)

    for (let i = 0; i < circles.length; ++i) {
        for (let j = i + 1; j < circles.length; ++j) {
            // Force calculation for every body
            i_mass = circles[i].mass
            j_mass = circles[j].mass

            let vector = createVector(circles[j].x - circles[i].x, circles[j].y - circles[i].y)
            let distance = dist(circles[i].x, circles[i].y, circles[j].x, circles[j].y) * 6
            distance = constrain(distance, 70, 2000)
            vector.normalize()

            force = G * (circles[i].mass * circles[j].mass) / (distance * distance)
            circles[i].v_x += force * vector.x
            circles[i].v_y += force * vector.y
            circles[j].v_x -= force * vector.x
            circles[j].v_y -= force * vector.y
        }
    }

    for (body of circles) {
        velocity_magnitude = sqrt((body.v_x ** 2) * (body.v_y ** 2)) * 2

        body.move()
        overlay.stroke(int(log(velocity_magnitude)) * 30, 20, 130)
        circle(body.x, body.y, body.diameter)

        overlay.line(body.x, body.y, body.x + body.v_x, body.y + body.v_y)
    }
}